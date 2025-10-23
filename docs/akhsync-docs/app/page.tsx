import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import QuickLinkCard from '@/components/QuickLinkCard/QuickLinkCard';
import InfoBox from '@/components/InfoBox/InfoBox';
import styles from './page.module.css';

export default function Home() {
    return (
        <>
            <PageHeader title='🎮 akhsync ドキュメント' description='Minecraft Bedrock Edition アドオン開発のための強力なCLIライブラリ' isHero />

            <ContentSection id='home'>
                <h2>Welcome to akhsync</h2>
                <p>akhsync は、AKHStudio によって作成された、Minecraft Bedrock Edition 用のアドオンを開発するためのCLIライブラリです。</p>

                <InfoBox>
                    <p>
                        <strong>🚀 開発プロセスを効率化</strong>
                        <br />
                        ファイルの同期や管理が容易になり、アドオン開発が大幅にスピードアップします。
                    </p>
                </InfoBox>
            </ContentSection>

            <ContentSection>
                <h2>What is akhsync?</h2>
                <p>akhsync は、Minecraft Bedrock Edition のアドオン開発を支援するための強力なCLIライブラリです。このライブラリを使用することで、ファイルの同期や管理が容易になり、開発プロセスが大幅に効率化されます。</p>

                <h3>主な機能</h3>
                <ul>
                    <li>
                        <span className={styles.badge}>TypeScript</span>
                        完全なTypeScriptサポート
                    </li>
                    <li>
                        <span className={`${styles.badge} ${styles.secondary}`}>Debug</span>
                        Minecraft Bedrock Debuggerとの統合
                    </li>
                    <li>ファイルの自動同期とビルド</li>
                    <li>リアルタイムでの変更監視</li>
                    <li>配布用パッケージの簡単生成</li>
                </ul>
            </ContentSection>

            <ContentSection>
                <h2>Quick Links</h2>
                <div className={styles.quickLinks}>
                    <QuickLinkCard href='/installation' title='📦 インストール' description='akhsyncの導入方法' />
                    <QuickLinkCard href='/quickstart' title='🚀 クイックスタート' description='すぐに始めるためのガイド' />
                    <QuickLinkCard href='#commands' title='⌨️ コマンド一覧' description='利用可能なコマンド' />
                    <QuickLinkCard href='#development' title='🛠️ 開発ドキュメント' description='詳細な開発情報' />
                </div>
            </ContentSection>

            <ContentSection id='commands'>
                <h2>コマンド一覧</h2>
                <p>akhsyncは以下のコマンドを提供しています。各コマンドをクリックすると詳細ページに移動します。</p>

                <div className={styles.quickLinks}>
                    <QuickLinkCard href='/commands/build' title='🔨 build' description='アドオンをビルドします' />
                    <QuickLinkCard href='/commands/sync' title='🔄 sync' description='ファイルを同期します' />
                    <QuickLinkCard href='/commands/async' title='⚡ async' description='非同期処理を実行します' />
                    <QuickLinkCard href='/commands/watch' title='👀 watch' description='ファイルの変更を監視します' />
                    <QuickLinkCard href='/commands/dist' title='📦 dist' description='配布用パッケージを作成します' />
                </div>
            </ContentSection>

            <ContentSection id='development'>
                <h2>リソース & フィードバック</h2>
                <p>akhsyncの詳細情報やフィードバックは以下のリンクからアクセスできます。</p>

                <div style={{ marginTop: '1.5rem' }}>
                    <a href='https://github.com/AKHstudio/akh_file_sync' className={styles.linkButton} target='_blank' rel='noopener noreferrer'>
                        📂 GitHub Repository
                    </a>
                    <a href='https://www.npmjs.com/package/@akhstudio/akhsync' className={styles.linkButton} target='_blank' rel='noopener noreferrer'>
                        📦 npm Package
                    </a>
                    <a href='https://github.com/AKHstudio/akh_file_sync/issues' className={`${styles.linkButton} ${styles.secondary}`} target='_blank' rel='noopener noreferrer'>
                        🐛 Issue Report
                    </a>
                </div>

                <InfoBox style={{ marginTop: '2rem' }}>
                    <p>
                        <strong>📢 バグ報告やフィードバック</strong>
                        <br />
                        GitHubリポジトリの
                        <a href='https://github.com/AKHstudio/akh_file_sync/issues' target='_blank' rel='noopener noreferrer'>
                            Issuesセクション
                        </a>
                        で受け付けています。お気軽にご報告ください。
                    </p>
                </InfoBox>
            </ContentSection>
        </>
    );
}
