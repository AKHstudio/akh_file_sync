import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';

type Octokit = ReturnType<typeof github.getOctokit>;
type PullsListResponse = Awaited<ReturnType<Octokit['rest']['pulls']['list']>>;
type PullRequest = PullsListResponse['data'][number];

interface CategoryInfo {
    title: string;
    priority: number;
}

interface CategorizedPRs {
    [category: string]: {
        prs: PullRequest[];
        priority: number;
    };
}

// カテゴリマッピング（ラベル → カテゴリ）
const CATEGORY_MAP: Record<string, CategoryInfo> = {
    breaking: { title: '### 💥 Breaking Changes', priority: 1 },
    'breaking-change': { title: '### 💥 Breaking Changes', priority: 1 },
    feature: { title: '### ✨ Features', priority: 2 },
    enhancement: { title: '### ✨ Features', priority: 2 },
    bug: { title: '### 🐛 Bug Fixes', priority: 3 },
    bugfix: { title: '### 🐛 Bug Fixes', priority: 3 },
    fix: { title: '### 🐛 Bug Fixes', priority: 3 },
    security: { title: '### 🔒 Security', priority: 4 },
    performance: { title: '### ⚡ Performance', priority: 5 },
    perf: { title: '### ⚡ Performance', priority: 5 },
    documentation: { title: '### 📖 Documentation', priority: 6 },
    docs: { title: '### 📖 Documentation', priority: 6 },
    refactor: { title: '### 🔨 Refactoring', priority: 7 },
    test: { title: '### 🧪 Tests', priority: 8 },
    tests: { title: '### 🧪 Tests', priority: 8 },
    chore: { title: '### 🔧 Chore', priority: 9 },
    ci: { title: '### 🤖 CI/CD', priority: 10 },
    dependencies: { title: '### 📦 Dependencies', priority: 11 },
    deps: { title: '### 📦 Dependencies', priority: 11 },
};

async function run(): Promise<void> {
    try {
        // 入力パラメータの取得
        const token = core.getInput('github-token', { required: true });
        const version = core.getInput('version', { required: true });

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        core.info(`Generating release notes for version ${version}`);

        // 前回のタグを取得
        const previousTag = await getPreviousTag(octokit, owner, repo);
        core.info(`Previous tag: ${previousTag || 'None (first release)'}`);

        // 前回のタグから現在までのPRを取得
        const prs = await getPRsSinceTag(octokit, owner, repo, previousTag);
        core.info(`Found ${prs.length} merged PRs`);

        // PRをカテゴリごとに分類
        const categorizedPRs = categorizePRs(prs);

        // リリースノートを生成
        const releaseNotes = generateReleaseNotes(version, categorizedPRs);

        // CHANGELOG.mdに追記
        await updateChangelog(releaseNotes);

        // 個別のバージョンファイルを作成
        const versionFilePath = path.join('changelogs', `${version}.md`);
        await createVersionFile(versionFilePath, releaseNotes);

        core.info('Release notes generated successfully!');
        core.setOutput('changelog-path', versionFilePath);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed('An unknown error occurred');
        }
    }
}

/**
 * 前回のタグを取得
 */
async function getPreviousTag(octokit: ReturnType<typeof github.getOctokit>, owner: string, repo: string): Promise<string | null> {
    try {
        const { data: tags } = await octokit.rest.repos.listTags({
            owner,
            repo,
            per_page: 1,
        });

        return tags.length > 0 ? tags[0].name : null;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        core.warning(`Failed to get previous tag: ${message}`);
        return null;
    }
}

/**
 * 指定したタグ以降にマージされたPRを取得
 */
async function getPRsSinceTag(octokit: ReturnType<typeof github.getOctokit>, owner: string, repo: string, tagName: string | null): Promise<PullRequest[]> {
    let since: string | null = null;

    if (tagName) {
        try {
            // タグのコミット情報を取得
            const { data: tag } = await octokit.rest.git.getRef({
                owner,
                repo,
                ref: `tags/${tagName}`,
            });

            const { data: commit } = await octokit.rest.git.getCommit({
                owner,
                repo,
                commit_sha: tag.object.sha,
            });

            since = commit.committer.date;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            core.warning(`Failed to get tag date: ${message}`);
        }
    }

    // releaseブランチにマージされたPRを取得
    const { data: pullRequests } = await octokit.rest.pulls.list({
        owner,
        repo,
        state: 'closed',
        base: 'release',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
    });

    // マージされたPRのみフィルタリング
    let mergedPRs = pullRequests.filter((pr) => pr.merged_at !== null);

    // since以降のPRのみフィルタリング
    if (since) {
        mergedPRs = mergedPRs.filter((pr) => pr.merged_at && new Date(pr.merged_at) > new Date(since));
    }

    return mergedPRs;
}

/**
 * PRをラベルに基づいてカテゴリ分け
 */
function categorizePRs(prs: PullRequest[]): CategorizedPRs {
    const categories: CategorizedPRs = {};

    for (const pr of prs) {
        let category: string | null = null;
        let categoryInfo: CategoryInfo | null = null;

        // PRのラベルをチェック
        for (const label of pr.labels) {
            const labelName = label.name.toLowerCase();
            if (CATEGORY_MAP[labelName]) {
                // 優先度が高いカテゴリを選択（数字が小さいほど優先）
                if (!categoryInfo || CATEGORY_MAP[labelName].priority < categoryInfo.priority) {
                    category = CATEGORY_MAP[labelName].title;
                    categoryInfo = CATEGORY_MAP[labelName];
                }
            }
        }

        // カテゴリが見つからない場合はその他に分類
        if (!category || !categoryInfo) {
            category = '### 📝 Other Changes';
            categoryInfo = { title: category, priority: 999 };
        }

        if (!categories[category]) {
            categories[category] = {
                prs: [],
                priority: categoryInfo.priority,
            };
        }

        categories[category].prs.push(pr);
    }

    return categories;
}

/**
 * リリースノートを生成
 */
function generateReleaseNotes(version: string, categorizedPRs: CategorizedPRs): string {
    const date = new Date().toISOString().split('T')[0];
    let notes = `## ${version} - ${date}\n\n`;

    // カテゴリを優先度順にソート
    const sortedCategories = Object.entries(categorizedPRs).sort(([, a], [, b]) => a.priority - b.priority);

    for (const [category, { prs }] of sortedCategories) {
        notes += `${category}\n\n`;

        for (const pr of prs) {
            const prLink = `[#${pr.number}](${pr.html_url})`;
            const author = pr.user ? `[@${pr.user.login}](${pr.user.html_url})` : '@unknown';
            notes += `- ${pr.title} ${prLink} by ${author}\n`;
        }

        notes += '\n';
    }

    return notes;
}

/**
 * CHANGELOG.mdを更新
 */
async function updateChangelog(releaseNotes: string): Promise<void> {
    const changelogPath = 'CHANGELOG.md';
    let content = '';

    // 既存のCHANGELOG.mdがあれば読み込む
    if (fs.existsSync(changelogPath)) {
        content = fs.readFileSync(changelogPath, 'utf8');
    } else {
        // 新規作成の場合はヘッダーを追加
        content = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }

    // 新しいリリースノートを行末に追加
    content += releaseNotes;

    fs.writeFileSync(changelogPath, content);
    core.info(`Updated ${changelogPath}`);
}

/**
 * 個別のバージョンファイルを作成
 */
async function createVersionFile(filePath: string, releaseNotes: string): Promise<void> {
    const dir = path.dirname(filePath);

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, releaseNotes);
    core.info(`Created ${filePath}`);
}

run();
