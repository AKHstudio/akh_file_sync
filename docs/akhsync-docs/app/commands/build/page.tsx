import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import InfoBox from '@/components/InfoBox/InfoBox';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from '../commands.module.css';

export default function BuildCommand() {
    return (
        <>
            <PageHeader title='🔨 akhsync build' description='アドオンをビルドするコマンド' />

            <ContentSection>
                <h2>概要</h2>
                <p>
                    アドオンをビルドします。ビルド結果は <code>./build</code> ディレクトリに出力されます。
                </p>
                <p>ほとんどのコマンドは内部的にこのコマンドを使用しています。</p>
            </ContentSection>

            <ContentSection>
                <h2>Usage</h2>
                <CodeBlock code='<span class="command">npx akhsync build [directories...] [options]</span>' lang='bash' />
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
                                <td>ビルド対象のアドオンのディレクトリ名を指定します。指定しない場合はすべてのアドオンがビルドされます。</td>
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
                                    <code>-o, --only &lt;type&gt;</code>
                                </td>
                                <td>指定したタイプ(behavior または resource)のビルドのみ行います。指定しない場合は両方ビルドされます。</td>
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

                <h3>通常ビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync build</span>' lang='bash' />

                <h3>開発モードでビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync build --development</span>' lang='bash' />

                <h3>デバッグモードでビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync build --debug</span>' lang='bash' />

                <h3>特定のアドオンを指定してビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync build informant test-addon</span>' lang='bash' />

                <h3>特定のタイプのみビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync build --only behavior</span>' lang='bash' />
            </ContentSection>

            <ContentSection>
                <h2>よくある使用例</h2>
                <InfoBox>
                    <p>
                        <strong>💡 開発時の推奨設定</strong>
                        <br />
                        開発中は <code>--development</code> オプションを使用することで、デバッグが容易になります。本番環境向けには通常ビルドを使用してください。
                    </p>
                </InfoBox>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/#commands',
                    label: '← 前へ',
                    title: 'コマンド一覧',
                }}
                next={{
                    href: '/commands/sync',
                    label: '次へ →',
                    title: 'sync コマンド',
                }}
            />
        </>
    );
}
