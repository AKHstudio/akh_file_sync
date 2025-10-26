import PageHeader from '@/components/PageHeader/PageHeader';
import ContentSection from '@/components/ContentSection/ContentSection';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import Alert from '@/components/Alert/Alert';
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';
import styles from './config.module.css';

export default function Installation() {
    return (
        <>
            <PageHeader title='⚙️ 設定ファイル' description='akhsyncの設定ファイルについて' />

            <ContentSection>
                <h2>設定ファイルへの導入</h2>

                <p>
                    akhsyncはプロジェクトルートに <code>akhsync.config.ts</code> という名前の設定ファイルを配置することで、各種設定をカスタマイズできます。
                </p>

                <Alert type='tip' title='対応しているファイル形式'>
                    <p>akhsync.configは以下のファイル形式に対応しています。</p>
                    <code>js, cjs, mjs, ts, mts</code>
                </Alert>
            </ContentSection>

            <ContentSection>
                <h2>記述方法</h2>

                <p>設定ファイルはmodule形式のdefault exportによって記述する必要があります。以下は主な設定項目の例です。</p>

                <CodeBlock
                    code={`import type { AkhsyncConfig } from '@akhstudio/akhsync/config';

const config: AkhsyncConfig = {
    syncTargetDir: "./sync_target",
    worldDirName: "world",
};

export default config;
`}
                />
            </ContentSection>

            <ContentSection>
                <h2>設定項目</h2>

                <p>以下はakhsyncの設定項目の一覧です。　</p>

                <Alert type='note' title='🏷️ 型定義ファイルの場所'>
                    <p>
                        型定義ファイルは <code>@akhstudio/akhsync/config</code> パッケージに含まれており、プロジェクトにインストールされている場合に参照できます。
                    </p>
                </Alert>

                <Alert type='warning' title='⚠️ 注意'>
                    <p>akhsync.configは現在開発中です。</p>
                    <p>これらの設定項目は将来的に変更される可能性があります。最新の情報については公式ドキュメントを参照してください。</p>
                </Alert>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>設定項目</th>
                            <th>説明</th>
                            <th>type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 600 }}>syncTargetDir</td>
                            <td>同期対象ディレクトリのパス</td>
                            <td>string</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>worldDirName</td>
                            <td>ワールドディレクトリ名 (あくまで名前を指定するだけの項目です)</td>
                            <td>string</td>
                        </tr>
                    </tbody>
                </table>
            </ContentSection>

            <NavigationButtons
                prev={{
                    href: '/#commands',
                    label: '← 前へ',
                    title: 'コマンド一覧',
                }}
                next={{
                    href: '/#development',
                    label: '次へ →',
                    title: '開発用ドキュメント',
                }}
            />
        </>
    );
}
