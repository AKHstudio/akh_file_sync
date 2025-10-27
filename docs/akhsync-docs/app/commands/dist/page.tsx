import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import InfoBox from '@/components/InfoBox/InfoBox';
import Alert from '@/components/Alert/Alert';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from '../commands.module.css';

export default function DistCommand() {
    return (
        <>
            <PageHeader title='📦 akhsync dist' description='配布用パッケージを作成するコマンド' />

            <ContentSection>
                <h2>概要</h2>
                <p>アドオンの配布用パッケージを作成します。ワールドデータと一緒に配布する形式と、アドオン単体で配布する形式の両方に対応しています。</p>
            </ContentSection>

            <ContentSection>
                <h2>Usage</h2>
                <CodeBlock code='<span class="command">npx akhsync dist [directories...] [options]</span>' lang='bash' />
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
                                <td>配布用にビルド対象のアドオンのディレクトリ名を指定します。指定しない場合はすべてのアドオンが対象となります。</td>
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
                                    <code>-t, --type &lt;type&gt;</code>
                                </td>
                                <td>
                                    指定したタイプ(<code>world</code> または <code>addon</code>
                                    )の配布用ビルドのみ行います。指定しない場合は両方ビルドされます。
                                </td>
                                <td>
                                    <code>addon</code>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>--set-version &lt;version&gt;</code>
                                </td>
                                <td>
                                    配布用ビルドに使用するバージョンを指定します。指定しない場合は
                                    <code>package.json</code>のバージョンが使用されます。
                                </td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>
                                    <code>--set-world-name &lt;name&gt;</code>
                                </td>
                                <td>
                                    配布用ビルドに使用するワールド名を指定します。
                                    <code>{'{name}'}</code>はアドオン名、
                                    <code>{'{version}'}</code>はバージョンに置き換えられます。
                                </td>
                                <td>
                                    <code>
                                        &quot;{'{name}'} {'{version}'}&quot;
                                    </code>
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

                <Alert type='important' title='❗ IMPORTANT'>
                    <p>
                        <code>--type world</code>を指定した場合、<code>world</code>ディレクトリが存在しない場合、エラーになります。
                    </p>
                </Alert>

                <Alert type='warning' title='⚠️ WARNING'>
                    <p>
                        この<code>type</code>オプションは<code>akhsync build</code>や<code>akhsync sync</code>の<code>--only</code>
                        オプションとは異なり、<code>world</code>と<code>addon</code>
                        の2種類の配布用ビルドを指します。
                    </p>
                </Alert>

                <Alert type='warning' title='⚠️ WARNING'>
                    <p>スペースを含むワールド名を指定する場合、コマンドラインでの解釈を避けるために引用符("")で囲む必要があります。</p>
                </Alert>
            </ContentSection>

            <ContentSection>
                <h2>Examples</h2>

                <h3>通常配布用ビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync dist</span>' lang='bash' />

                <h3>特定のアドオンを指定して配布用ビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync dist informant test-addon</span>' lang='bash' />

                <h3>特定のタイプのみ配布用ビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync dist --type world</span>' lang='bash' />

                <h3>特定のバージョンを指定して配布用ビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync dist --set-version 1.2.3</span>' lang='bash' />

                <h3>特定のワールド名を指定して配布用ビルド</h3>
                <CodeBlock code='<span class="command">npx akhsync dist --set-world-name "My Addon World v{version}"</span>' lang='bash' />
            </ContentSection>

            <ContentSection>
                <h2>よくある使用例</h2>
                <InfoBox>
                    <p>
                        <strong>💡 配布形式の選択</strong>
                        <br />
                        <code>--type addon</code>
                        を使用すると、アドオン単体のパッケージが作成されます。
                        <code>--type world</code>
                        を使用すると、ワールドデータを含むパッケージが作成されます。用途に応じて使い分けてください。
                    </p>
                </InfoBox>

                <Alert type='tip' title='💡 TIP'>
                    <p>
                        配布前には必ずバージョン番号を確認し、<code>--set-version</code>
                        オプションで明示的に指定することをお勧めします。これにより、ユーザーがどのバージョンを使用しているか明確になります。
                    </p>
                </Alert>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/commands/watch',
                    label: '← 前へ',
                    title: 'watch コマンド',
                }}
                next={{
                    href: '/config',
                    label: '次へ →',
                    title: '設定ファイル',
                }}
            />
        </>
    );
}
