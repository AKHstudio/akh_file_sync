import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import Alert from '@/components/Alert/Alert';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import QuickLinkCard from '@/components/QuickLinkCard/QuickLinkCard';
import styles from './quickstart.module.css';

export default function Quickstart() {
  return (
    <>
      <PageHeader
        title="🚀 クイックスタートガイド"
        description="akhsyncを使ったアドオン開発をすぐに始める"
      />

      <ContentSection>
        <h2>1. npm の初期化</h2>
        <p>まず、新しいプロジェクトを初期化します:</p>

        <CodeBlock
          code='<span class="command">npm init your_project_name -y</span>'
          lang="bash"
        />

        <p>
          このコマンドで <code>package.json</code> が自動的に作成されます。
        </p>
      </ContentSection>

      <ContentSection>
        <h2>2. ファイル構造の作成</h2>
        <p>アドオン開発プロジェクトのルートディレクトリ構造は以下のようになります:</p>

        <div className={styles.fileTree}>
{`your_project_root
    |-- src/ (開発用ソースコード)
        |-- addon1/
            |-- behavior_packs/
            |   |-- scripts/
            |       |-- main.js
            |-- resource_packs/
        |-- addon2/ (複数のアドオンを開発する場合 - オプション)
            |-- behavior_packs/
            |   |-- scripts/
            |       |-- main.ts
            |-- resource_packs/
    |-- world/ (ビルド用のワールドデータ - オプション)
    |-- tsconfig.json (TypeScriptを使用する場合のみ)
    |-- package.json`}
        </div>

        <p>この構造に従ってディレクトリとファイルを作成してください。</p>
      </ContentSection>

      <ContentSection>
        <h2>3. 必要なライブラリのインストール</h2>
        <p>
          使用したいバージョンに応じて <code>@minecraft</code>{' '}
          ライブラリをインストールします。
        </p>

        <h3>akhsync</h3>
        <CodeBlock
          code='<span class="command">npm install @akhstudio/akhsync@latest --save-dev</span>'
          lang="bash"
        />

        <h3>@minecraft/server</h3>
        <CodeBlock
          code='<span class="command">npm install @minecraft/server@latest --save-dev</span>'
          lang="bash"
        />

        <h3>@minecraft/server-ui (UI を使用する場合)</h3>
        <CodeBlock
          code='<span class="command">npm install @minecraft/server-ui@latest --save-dev</span>'
          lang="bash"
        />
      </ContentSection>

      <ContentSection>
        <h2>4. package.json にスクリプトを追加</h2>
        <p>
          <code>package.json</code> の <code>scripts</code>{' '}
          セクションに以下を追加します:
        </p>

        <CodeBlock
          code={`{
    <span class="key">"scripts"</span>: {
        <span class="key">"build"</span>: <span class="string">"akhsync build"</span>,
        <span class="key">"sync"</span>: <span class="string">"akhsync sync"</span>,
        <span class="key">"async"</span>: <span class="string">"akhsync async"</span>,
        <span class="key">"watch"</span>: <span class="string">"akhsync watch"</span>,
        <span class="key">"dist"</span>: <span class="string">"akhsync dist"</span>
    }
}`}
          lang="json"
        />

        <Alert type="tip" title="💡 TIP">
          <p>
            追加のオプションを指定したい場合は、<code>--</code> の後に追加してください。
          </p>
        </Alert>

        <CodeBlock
          code='<span class="command">npm run build -- --development</span>'
          lang="bash"
        />
      </ContentSection>

      <ContentSection>
        <h2>次のステップ</h2>
        <p>
          セットアップが完了しました!次は実際にコマンドを使ってアドオン開発を始めましょう。
        </p>

        <Alert type="note" title="📌 NOTE">
          <p>
            ローカルインストールの場合、<code>npm run</code> を使わずに{' '}
            <code>npx akhsync</code> コマンドで直接実行することもできます。
          </p>
          <p>
            例: <code>npx akhsync build</code> または{' '}
            <code>npx akhsync watch</code>
          </p>
        </Alert>

        <div className={styles.quickLinks}>
          <QuickLinkCard
            href="/#commands"
            title="⌨️ コマンド一覧"
            description="利用可能なコマンドを確認"
          />
          <QuickLinkCard
            href="https://github.com/AKHstudio/akh_file_sync"
            title="📖 サンプル"
            description="GitHubでサンプルコードを見る"
            external
          />
        </div>
      </ContentSection>

      <NavigationButtons
        prev={{
          href: '/installation',
          label: '← 前へ',
          title: 'インストール',
        }}
        next={{
          href: '/#commands',
          label: '次へ →',
          title: 'コマンド一覧',
        }}
      />
    </>
  );
}
