import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import InfoBox from '@/components/InfoBox/InfoBox';
import Alert from '@/components/Alert/Alert';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from '../commands.module.css';

export default function AsyncCommand() {
    return (
        <>
            <PageHeader title='⚡ akhsync async' description='同期したアドオンをクリアするコマンド' />

            <ContentSection>
                <h2>概要</h2>
                <p>
                    <code>development_{'{type}'}_packs</code> に同期したアドオンをクリアします。
                </p>
                <p>
                    ここでのクリアとは、<code>development_{'{type}'}_packs</code> フォルダ内のアドオンファイルを削除することを指します。
                </p>
            </ContentSection>

            <ContentSection>
                <h2>Usage</h2>
                <CodeBlock code='<span class="command">npx akhsync async [directories...] [options]</span>' lang='bash' />
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
                                <td>クリア対象のアドオンのディレクトリ名を指定します。指定しない場合はすべてのアドオンがクリアされます。</td>
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
                                    <code>-o, --only &lt;type&gt;</code>
                                </td>
                                <td>指定したタイプ(behavior または resource)のクリアのみ行います。指定しない場合は両方クリアされます。</td>
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

                <h3>通常クリア</h3>
                <CodeBlock code='<span class="command">npx akhsync async</span>' lang='bash' />

                <h3>特定のアドオンを指定してクリア</h3>
                <CodeBlock code='<span class="command">npx akhsync async informant test-addon</span>' lang='bash' />

                <h3>特定のタイプのみクリア</h3>
                <CodeBlock code='<span class="command">npx akhsync async --only behavior</span>' lang='bash' />
            </ContentSection>

            <ContentSection>
                <h2>よくある使用例</h2>
                <InfoBox>
                    <p>
                        <strong>💡 使用シーン</strong>
                        <br />
                        開発環境をクリーンな状態に戻したい場合や、特定のアドオンの同期を解除したい場合に使用します。Minecraftの開発環境から不要なアドオンファイルを削除できます。
                    </p>
                </InfoBox>

                <Alert type='warning' title='⚠️ 注意'>
                    <p>
                        このコマンドは <code>development_{'{type}'}_packs</code> からファイルを削除します。元のソースコードには影響しませんが、実行前に確認することをお勧めします。
                    </p>
                </Alert>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/commands/sync',
                    label: '← 前へ',
                    title: 'sync コマンド',
                }}
                next={{
                    href: '/commands/watch',
                    label: '次へ →',
                    title: 'watch コマンド',
                }}
            />
        </>
    );
}
