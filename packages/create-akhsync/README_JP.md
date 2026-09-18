# create-akhsync

たった1つのコマンドでAkhsyncプロジェクトを作成 - Minecraft統合版アドオン開発を始める最も簡単な方法。

[![npm version](https://img.shields.io/npm/v/create-akhsync.svg)](https://www.npmjs.com/package/create-akhsync)
[![License](https://img.shields.io/npm/l/create-akhsync.svg)](https://github.com/AKHstudio/akh_file_sync/blob/main/LICENSE)

## クイックスタート

```bash
npm create akhsync@latest
```

プロジェクト名を指定する場合:

```bash
npm create akhsync@latest my-addon
```

## 特徴

✨ **インタラクティブCLI** - いくつかの質問に答えるだけでプロジェクト設定完了  
📦 **複数のテンプレート** - TypeScriptまたはJavaScriptから選択可能  
🔧 **開発ツール** - ESLintとPrettierのオプション設定  
🎨 **カスタマイズ可能** - プロジェクトを好みに合わせて設定  
🚀 **すぐに開発開始** - セットアップ後すぐに開発を始められます

## 使用方法

### インタラクティブモード（推奨）

引数なしで実行すると、インタラクティブモードに入ります:

```bash
npm create akhsync@latest
```

以下の設定を行います:

- プロジェクト名
- アドオン名
- 説明
- TypeScript（デフォルト: はい）
- ESLint（デフォルト: はい）
- Prettier（デフォルト: はい）
- Git初期化（デフォルト: はい）

### CLIモード

コマンドラインフラグを使用してプロンプトをスキップ:

```bash
npm create akhsync@latest my-addon --yes
```

### 利用可能なオプション

```
使用方法: create-akhsync [project-name] [options]

引数:
  project-name         作成するプロジェクトの名前 (デフォルト: "akhsync-project")

オプション:
  -v, --version        現在のバージョンを表示
  --git                Gitリポジトリを初期化
  --typescript         TypeScriptを使用（デフォルト）
  --lint               ESLint設定をセットアップ
  --prettier           Prettier設定をセットアップ
  -y, --yes            プロンプトをスキップしてデフォルト値を使用
  -h, --help           使用方法を表示
```

## 含まれるもの

生成されるプロジェクトには以下が含まれます:

```
my-addon/
├── src/
│   └── my-addon/
│       ├── behavior_packs/
│       │   ├── manifest.json
│       │   └── scripts/
│       │       └── main.ts (または main.js)
│       └── resource_packs/
│           └── manifest.json
├── akhsync.config.ts (または .js)
├── package.json
├── tsconfig.json (TypeScriptの場合)
├── eslint.config.js (有効化した場合)
├── .prettierrc (有効化した場合)
└── .gitignore
```

## 始め方

プロジェクト作成後:

1. **プロジェクトに移動:**

    ```bash
    cd my-addon
    ```

2. **依存関係をインストール:**

    ```bash
    npm install
    ```

3. **開発開始:**
    ```bash
    npm run build    # アドオンをビルド
    npm run watch    # 変更を監視して自動リビルド
    npm run sync     # Minecraftディレクトリに同期
    ```

## 生成されるスクリプト

プロジェクトには事前設定されたnpmスクリプトが含まれます:

- `npm run build` - アドオンをビルド
- `npm run sync` - Minecraftに同期
- `npm run async` - 非同期同期
- `npm run watch` - 開発用のウォッチモード
- `npm run dist` - 配布パッケージを作成

ESLintを有効化した場合:

- `npm run lint` - リントエラーをチェック
- `npm run lint:fix` - リントエラーを修正

Prettierを有効化した場合:

- `npm run format` - コードフォーマットをチェック
- `npm run format:fix` - コードフォーマットを修正

## テンプレートの機能

### TypeScriptテンプレート

- 完全なTypeScriptサポート
- @minecraft/serverの型定義
- 設定済みのtsconfig.json
- IntelliSenseサポート

### JavaScriptテンプレート

- モダンなESモジュール
- TypeScriptと同じプロジェクト構造
- コンパイルなしで高速セットアップ

### 両テンプレートに含まれるもの

- 事前設定されたmanifest.jsonファイル
- イベントハンドラを含むサンプルスクリプト
- 適切なUUID生成
- @minecraft/server統合
- Akhsync設定

## 必要要件

- Node.js 20.11.1以上
- npm、yarn、またはpnpm

## 例

### TypeScriptで作成（デフォルト）

```bash
npm create akhsync@latest my-awesome-addon
```

### JavaScriptで作成

```bash
npm create akhsync@latest my-addon
# プロンプトでJavaScriptを選択
```

### すべてデフォルト値で作成

```bash
npm create akhsync@latest my-addon --yes
```

### Gitなしで作成

```bash
npm create akhsync@latest my-addon
# Git初期化のプロンプトで「いいえ」を選択
```

## ドキュメント

Akhsyncとアドオン開発の詳細については:

- [Akhsyncドキュメント](https://akhstudio.github.io/akh_file_sync/)
- [GitHubリポジトリ](https://github.com/AKHstudio/akh_file_sync)

## ライセンス

GPL-3.0 - 詳細は[LICENSE](LICENSE)を参照

## 作者

AKHstudio (tako1dayo)

---

Minecraft統合版コミュニティのために ❤️ を込めて作成
