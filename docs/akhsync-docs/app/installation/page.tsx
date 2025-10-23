import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import Alert from '@/components/Alert/Alert';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from './installation.module.css';

export default function Installation() {
    return (
        <>
            <PageHeader title='📦 インストール方法' description='akhsyncをプロジェクトに導入する方法' />

            <ContentSection>
                <h2>プロジェクトへのインストール</h2>
                <p>
                    プロジェクトが既に初期化されている場合は、以下のコマンドで <code>akhsync</code> をインストールできます:
                </p>

                <CodeBlock code='<span class="command">npm install @akhstudio/akhsync@latest --save-dev</span>' lang='bash' />

                <p>このコマンドにより、akhsyncが開発依存関係としてプロジェクトに追加されます。</p>
            </ContentSection>

            <ContentSection>
                <h2>グローバルインストール</h2>

                <Alert type='note' title='📌 NOTE'>
                    <p>
                        <code>-g</code> オプションを使用すると、グローバルにインストールされ、
                        <code>akhsync</code> コマンドを直接使用できるようになります。
                    </p>
                </Alert>

                <CodeBlock code='<span class="command">npm install -g @akhstudio/akhsync@latest</span>' lang='bash' />

                <Alert type='important' title='❗ IMPORTANT'>
                    <p>グローバルにインストールする場合は、プロジェクトのディレクトリ構造に注意してください。</p>
                </Alert>
            </ContentSection>

            <ContentSection>
                <h2>インストール方法の選択</h2>
                <p>以下の表を参考に、プロジェクトに適したインストール方法を選択してください:</p>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>インストール方法</th>
                                <th>メリット</th>
                                <th>推奨用途</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 600 }}>ローカル</td>
                                <td>プロジェクトごとにバージョン管理可能</td>
                                <td>通常のプロジェクト開発</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>グローバル</td>
                                <td>どこからでもコマンド実行可能</td>
                                <td>複数プロジェクトでの使用</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/',
                    label: '← 前へ',
                    title: 'ホーム',
                }}
                next={{
                    href: '/quickstart',
                    label: '次へ →',
                    title: 'クイックスタート',
                }}
            />
        </>
    );
}
