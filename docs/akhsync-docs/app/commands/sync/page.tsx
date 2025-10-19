import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import InfoBox from '@/components/InfoBox/InfoBox';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from '../commands.module.css';

export default function SyncCommand() {
    return (
        <>
            <PageHeader title='🔄 akhsync sync' description='アドオンを開発環境に同期するコマンド' />

            <ContentSection>
                <h2>概要</h2>
                <p>
                    アドオンのソースコードを <code>development_{'{type}'}_packs</code> に同期します。
                </p>
            </ContentSection>

            <ContentSection>
                <h2>Process</h2>
                <p>syncコマンドは以下のプロセスで実行されます:</p>
                <ol style={{ listStyle: 'decimal', paddingLeft: '2rem', color: 'var(--text-secondary)' }}>
                    <li style={{ padding: '0.5rem 0' }}>
                        指定されたアドオンディレクトリをビルドします(<code>--no-build</code> オプションが指定された場合はスキップされます)。
                    </li>
                    <li style={{ padding: '0.5rem 0' }}>
                        前回の同期ファイルを <code>development_{'{type}'}_packs</code> から削除します。
                    </li>
                    <li style={{ padding: '0.5rem 0' }}>
                        ビルド結果を <code>development_{'{type}'}_packs</code> にコピーします。
                    </li>
                    <li style={{ padding: '0.5rem 0' }}>同期が完了したことを通知します。</li>
                </ol>
            </ContentSection>

            <ContentSection>
                <h2>Usage</h2>
                <CodeBlock code='<span class="command">npx akhsync sync [directories...] [options]</span>' lang='bash' />
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
                                <td>同期対象のアドオンのディレクトリ名を指定します。指定しない場合はすべてのアドオンが同期されます。</td>
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
                                <td>開発モードでビルドを行います。ソースマップが生成され、コードの最適化が無効になります。</td>
                                <td>
                                    <code>false</code>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>--debug</code>
                                </td>
                                <td>デバッグモードでビルドを行います。詳細なログが出力されます。</td>
                                <td>
                                    <code>false</code>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>--no-build</code>
                                </td>
                                <td>ビルドを行わずに同期のみを実行します。</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>-o, --only &lt;type&gt;</code>
                                </td>
                                <td>指定したタイプ(behavior または resource)の同期のみ行います。指定しない場合は両方同期されます。</td>
                                <td>-</td>
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

                <h3>通常同期</h3>
                <CodeBlock code='<span class="command">npx akhsync sync</span>' lang='bash' />

                <h3>開発モードで同期</h3>
                <CodeBlock code='<span class="command">npx akhsync sync --development</span>' lang='bash' />

                <h3>ビルドをスキップして同期</h3>
                <CodeBlock code='<span class="command">npx akhsync sync --no-build</span>' lang='bash' />
            </ContentSection>

            <ContentSection>
                <h2>よくある使用例</h2>
                <InfoBox>
                    <p>
                        <strong>💡 開発時のワークフロー</strong>
                        <br />
                        開発中は <code>--development</code> オプションを使用することで、Minecraftで即座にテストできます。
                        <code>--no-build</code> オプションは、既にビルド済みのファイルを素早く同期したい場合に便利です。
                    </p>
                </InfoBox>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/commands/build',
                    label: '← 前へ',
                    title: 'build コマンド',
                }}
                next={{
                    href: '/commands/async',
                    label: '次へ →',
                    title: 'async コマンド',
                }}
            />
        </>
    );
}
