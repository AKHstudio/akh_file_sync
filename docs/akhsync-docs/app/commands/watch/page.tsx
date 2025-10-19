import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import InfoBox from '@/components/InfoBox/InfoBox';
import Alert from '@/components/Alert/Alert';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from '../commands.module.css';

export default function WatchCommand() {
    return (
        <>
            <PageHeader title='👀 akhsync watch' description='ファイルの変更を監視して自動ビルド・同期' />

            <ContentSection>
                <h2>概要</h2>
                <p>アドオンのbehaviorディレクトリの変更を監視し、変更があった場合に自動的にビルドと同期を行います。</p>

                <Alert type='warning' title='⚠️ WARNING'>
                    <p>
                        監視中は連続でファイルを変更した場合、意図しない動作を引き起こす可能性があります。監視を停止するには、
                        <code>Ctrl + C</code> を押してください。
                    </p>
                </Alert>
            </ContentSection>

            <ContentSection>
                <h2>Usage</h2>
                <CodeBlock code='<span class="command">npx akhsync watch [directories...] [options]</span>' lang='bash' />
            </ContentSection>

            <ContentSection>
                <h2>Arguments</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>引数</th>
                                <th>説明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>directories...</code>
                                </td>
                                <td>監視対象のアドオンのディレクトリ名を指定します。指定しない場合はすべてのアドオンが監視されます。</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ContentSection>

            <ContentSection>
                <h2>Options</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>オプション</th>
                                <th>説明</th>
                                <th>デフォルト</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>-d, --development</code>
                                </td>
                                <td>開発モードでビルドと同期を行います。ソースマップが生成され、コードの最適化が無効になります。</td>
                                <td>
                                    <code>false</code>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>--debug</code>
                                </td>
                                <td>デバッグモードでビルドと同期を行います。詳細なログが出力されます。</td>
                                <td>
                                    <code>false</code>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>-h, --help</code>
                                </td>
                                <td>コマンドのヘルプを表示します。</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ContentSection>

            <ContentSection>
                <h2>Examples</h2>

                <h3>通常監視</h3>
                <CodeBlock code='<span class="command">npx akhsync watch</span>' lang='bash' />

                <h3>開発モードで監視</h3>
                <CodeBlock code='<span class="command">npx akhsync watch --development</span>' lang='bash' />

                <h3>デバッグモードで監視</h3>
                <CodeBlock code='<span class="command">npx akhsync watch --debug</span>' lang='bash' />

                <h3>特定のアドオンを指定して監視</h3>
                <CodeBlock code='<span class="command">npx akhsync watch informant test-addon</span>' lang='bash' />
            </ContentSection>

            <ContentSection>
                <h2>よくある使用例</h2>
                <InfoBox>
                    <p>
                        <strong>💡 開発時の効率化</strong>
                        <br />
                        開発中は <code>watch --development</code> を実行しておくことで、ファイルを保存するたびに自動的にMinecraftに反映されます。これにより、手動でビルドや同期を実行する手間が省けます。
                    </p>
                </InfoBox>

                <Alert type='tip' title='💡 TIP'>
                    <p>
                        監視を停止する場合は、ターミナルで <code>Ctrl + C</code>
                        (Windows/Linux)または <code>Cmd + C</code>(Mac)を押してください。
                    </p>
                </Alert>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/commands/async',
                    label: '← 前へ',
                    title: 'async コマンド',
                }}
                next={{
                    href: '/commands/dist',
                    label: '次へ →',
                    title: 'dist コマンド',
                }}
            />
        </>
    );
}
