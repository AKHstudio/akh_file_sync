import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join, relative, sep } from 'path';
import type { Plugin, PluginBuild, OnResolveArgs, OnResolveResult } from 'esbuild';
import stripJsonComments from 'strip-json-comments';

/**
 * TypeScript設定の構造
 */
interface TsConfig {
    compilerOptions?: {
        baseUrl?: string;
        paths?: Record<string, string[]>;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

/**
 * プラグインオプション
 */
interface TsPathsPluginOptions {
    /** tsconfig.jsonファイルのパス (デフォルト: ./tsconfig.json) */
    tsconfig?: string;
    /** デバッグログを有効化 (デフォルト: false) */
    debug?: boolean;
    /** 試行するファイル拡張子 (デフォルト: ['.ts', '.tsx', '.js', '.jsx', '.json']) */
    extensions?: string[];
    /** 処理から除外するパターンまたは完全一致するエイリアス */
    excludes?: string[];
    /** 処理から除外する正規表現パターン */
    excludePatterns?: RegExp[];
    /** 解決されたパスを外部モジュールとしてマーク（バンドルしない） (デフォルト: false) */
    external?: boolean;
    /** 特定のパターンのみを外部モジュールとしてマーク */
    externalPatterns?: string[];
    /** 解決されたパスを相対パスに変換（バンドルしないビルドで便利） */
    resolveToRelative?: boolean;
}

/**
 * 内部マッチャー構造
 */
interface PathMatcher {
    regex: RegExp;
    pattern: string;
    replacements: string[];
}

/**
 * TypeScript paths aliasを解決するesbuildプラグイン
 */
export const tsPathsPlugin = (options: TsPathsPluginOptions = {}): Plugin => {
    const { tsconfig = './tsconfig.json', debug = false, extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'], excludes = [], excludePatterns = [], external = false, externalPatterns = [], resolveToRelative = false } = options;

    const log = (message: string, ...args: unknown[]): void => {
        if (debug) {
            console.log(`[ts-paths] ${message}`, ...args);
        }
    };

    const warn = (message: string, ...args: unknown[]): void => {
        console.warn(`[ts-paths] ${message}`, ...args);
    };

    const error = (message: string, ...args: unknown[]): void => {
        console.error(`[ts-paths] ${message}`, ...args);
    };

    // パスを除外すべきかチェック
    const isExcluded = (path: string): boolean => {
        // 完全一致と前方一致をチェック
        for (const exclude of excludes) {
            if (exclude.endsWith('*')) {
                // 前方一致 (例: "@minecraft/*")
                const prefix = exclude.slice(0, -1);
                if (path.startsWith(prefix)) {
                    log(`パス "${path}" はパターン "${exclude}" により除外`);
                    return true;
                }
            } else {
                // 完全一致
                if (path === exclude || path.startsWith(exclude + '/')) {
                    log(`パス "${path}" は完全一致 "${exclude}" により除外`);
                    return true;
                }
            }
        }

        // 正規表現パターンをチェック
        for (const pattern of excludePatterns) {
            if (pattern.test(path)) {
                log(`パス "${path}" は正規表現パターン ${pattern} により除外`);
                return true;
            }
        }

        return false;
    };

    // 解決されたパスを外部モジュールとしてマークすべきかチェック
    const shouldBeExternal = (originalPath: string): boolean => {
        // externalがtrueなら、すべての解決されたパスを外部モジュール化
        if (external === true) {
            return true;
        }

        // パスが外部パターンに一致するかチェック
        for (const pattern of externalPatterns) {
            if (pattern.endsWith('*')) {
                const prefix = pattern.slice(0, -1);
                if (originalPath.startsWith(prefix)) {
                    log(`パス "${originalPath}" はパターン "${pattern}" により外部モジュール化`);
                    return true;
                }
            } else {
                if (originalPath === pattern || originalPath.startsWith(pattern + '/')) {
                    log(`パス "${originalPath}" は完全一致 "${pattern}" により外部モジュール化`);
                    return true;
                }
            }
        }

        return false;
    };

    return {
        name: 'ts-paths',
        setup(build: PluginBuild): void {
            // tsconfig.jsonの読み込みとパース
            let paths: Record<string, string[]> = {};
            let baseUrl = './';

            try {
                const configPath = resolve(process.cwd(), tsconfig);
                if (!existsSync(configPath)) {
                    warn(`tsconfig.json が見つかりません: ${configPath}`);
                    return;
                }

                log(`tsconfig を読み込み中: ${configPath}`);
                const configContent = stripJsonComments(readFileSync(configPath, 'utf-8'));
                const config: TsConfig = JSON.parse(configContent);

                // コンパイラオプションを抽出
                const compilerOptions = config.compilerOptions || {};
                paths = compilerOptions.paths || {};
                baseUrl = compilerOptions.baseUrl || './';

                // baseUrlをtsconfigの場所に対して解決
                const tsconfigDir = dirname(configPath);
                baseUrl = resolve(tsconfigDir, baseUrl);

                log(`解決されたbaseUrl: ${baseUrl}`);
                log(`${Object.keys(paths).length} 個のパスマッピングを検出`);
            } catch (err) {
                error('tsconfig.json の読み込みエラー:', err);
                return;
            }

            // 正規表現の特殊文字をエスケープするヘルパー関数
            const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // paths設定を正規表現パターンに変換
            const matchers: PathMatcher[] = [];

            for (const [pattern, replacements] of Object.entries(paths)) {
                // TypeScriptパスパターンを正規表現に変換
                // 例: "@utils/*" -> /^@utils\/(.*)$/
                const regexPattern = '^' + escapeRegex(pattern).replace(/\\\*/g, '(.*)') + '$';
                const regex = new RegExp(regexPattern);

                matchers.push({
                    regex,
                    pattern,
                    replacements: Array.isArray(replacements) ? replacements : [replacements],
                });

                log(`パターン登録: ${pattern} -> ${replacements.join(', ')}`);
            }

            // 異なる拡張子でファイルの解決を試みる
            const tryResolveFile = (basePath: string): string | null => {
                // まず正確なパスを試す
                if (existsSync(basePath)) {
                    return basePath;
                }

                // 拡張子を試す
                for (const ext of extensions) {
                    const pathWithExt = `${basePath}${ext}`;
                    if (existsSync(pathWithExt)) {
                        return pathWithExt;
                    }
                }

                // ディレクトリとしてindexファイルを試す
                for (const ext of extensions) {
                    const indexPath = join(basePath, `index${ext}`);
                    if (existsSync(indexPath)) {
                        return indexPath;
                    }
                }

                return null;
            };

            // モジュール解決を処理
            build.onResolve({ filter: /.*/ }, async (args: OnResolveArgs): Promise<OnResolveResult | null> => {
                // node_modules、相対パス、絶対パスはスキップ
                if (args.path.startsWith('.') || args.path.startsWith('/') || args.path.includes('node_modules')) {
                    return null;
                }

                // このパスを除外すべきかチェック
                if (isExcluded(args.path)) {
                    log(`除外されたパスをスキップ: ${args.path}`);
                    return null;
                }

                log(`解決中: ${args.path}`);

                // パスパターンとのマッチを試みる
                for (const matcher of matchers) {
                    const match = args.path.match(matcher.regex);

                    if (match) {
                        log(`パターン "${matcher.pattern}" が "${args.path}" にマッチ`);

                        // 各置換パターンを試す
                        for (const replacement of matcher.replacements) {
                            // 置換パターン内のワイルドカードを置き換え
                            let resolvedPath = replacement;

                            // ワイルドカードの置換を処理
                            if (match[1] !== undefined) {
                                resolvedPath = resolvedPath.replace('*', match[1]);
                            }

                            // フルパスを解決
                            const fullPath = resolve(baseUrl, resolvedPath);
                            log(`試行中: ${fullPath}`);

                            // ファイルの解決を試みる
                            const resolvedFile = tryResolveFile(fullPath);

                            if (resolvedFile) {
                                log(`解決完了: ${resolvedFile}`);

                                // resolveToRelativeが有効な場合、相対パスに変換
                                if (resolveToRelative && args.importer) {
                                    const importerDir = dirname(args.importer);
                                    let relativePath = relative(importerDir, resolvedFile);

                                    // 一貫性のためフォワードスラッシュを使用
                                    relativePath = relativePath.split(sep).join('/');

                                    // 拡張子が一致する場合は削除
                                    for (const ext of extensions) {
                                        if (relativePath.endsWith(ext)) {
                                            relativePath = relativePath.slice(0, -ext.length);
                                            break;
                                        }
                                    }

                                    // パスが . や / で始まらない場合は ./ を追加
                                    if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
                                        relativePath = './' + relativePath;
                                    }

                                    log(`相対パスに変換: ${relativePath}`);

                                    // 相対パスで外部モジュールとしてマーク
                                    return {
                                        path: relativePath,
                                        external: true,
                                    };
                                }

                                // 外部モジュールとすべきかチェック
                                if (shouldBeExternal(args.path)) {
                                    log(`外部モジュールとしてマーク: ${args.path}`);
                                    return {
                                        path: args.path,
                                        external: true,
                                    };
                                }

                                return {
                                    path: resolvedFile,
                                    namespace: 'file',
                                };
                            }
                        }

                        // パターンにマッチしたがファイルを解決できなかった場合、
                        // 警告をログに記録するがesbuildに処理を継続させる
                        warn(`パターン "${matcher.pattern}" が "${args.path}" にマッチしましたが、ファイルを解決できませんでした`);
                    }
                }

                // esbuildに解決を任せる
                return null;
            });
        },
    };
};

/**
 * 一般的なプリセットでプラグインを作成するヘルパー関数
 */
export const createTsPathsPlugin = (preset: 'node' | 'browser' | 'relative' = 'node', additionalOptions: Partial<TsPathsPluginOptions> = {}): Plugin => {
    if (preset === 'relative') {
        return tsPathsPlugin({
            resolveToRelative: true,
            ...additionalOptions,
        });
    }

    const extensions = preset === 'node' ? ['.ts', '.tsx', '.js', '.jsx', '.json', '.node'] : ['.ts', '.tsx', '.js', '.jsx', '.json'];

    return tsPathsPlugin({
        extensions,
        ...additionalOptions,
    });
};

// 外部使用のために型をエクスポート
export type { TsPathsPluginOptions, TsConfig };
