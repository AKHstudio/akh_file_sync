# create-akhsync 実装TODO

## 進捗状況

- [x]   1. プロジェクト構造とテンプレートの確認
- [x]   2. テンプレートファイルの作成（JavaScript/TypeScript）
- [x]   3. ヘルパー関数の実装
- [x]   4. インタラクティブプロンプトの実装
- [x]   5. メインロジックの実装
- [x]   6. Git初期化機能の実装
- [x]   7. 設定ファイル生成機能の実装
- [x]   8. テストとドキュメント（基本部分完了）

## 実装内容

### 1. プロジェクト構造とテンプレートの確認 ✅

#### 完了項目

- `debug/akhsync.config.ts` の内容を確認
- 現在のテンプレート構造を確認
- manifest.jsonのサンプルを確認

### 2. テンプレートファイルの作成（JavaScript/TypeScript） ✅

#### 作成したテンプレート

**TypeScript版:**

- `templates/typescript/package.json`
- `templates/typescript/tsconfig.json`
- `templates/typescript/akhsync.config.ts`
- `templates/typescript/.gitignore`
- `templates/typescript/eslint.config.js`
- `templates/typescript/.prettierrc`
- `templates/typescript/src/{{ADDON_NAME}}/behavior_packs/manifest.json`
- `templates/typescript/src/{{ADDON_NAME}}/behavior_packs/scripts/main.ts`
- `templates/typescript/src/{{ADDON_NAME}}/resource_packs/manifest.json`

**JavaScript版:**

- `templates/javascript/package.json`
- `templates/javascript/akhsync.config.js`
- `templates/javascript/.gitignore`
- `templates/javascript/eslint.config.js`
- `templates/javascript/.prettierrc`
- `templates/javascript/src/{{ADDON_NAME}}/behavior_packs/manifest.json`
- `templates/javascript/src/{{ADDON_NAME}}/behavior_packs/scripts/main.js`
- `templates/javascript/src/{{ADDON_NAME}}/resource_packs/manifest.json`

### 3. ヘルパー関数の実装 ✅

#### 作成したヘルパーモジュール

**helper/uuid.ts:**

- `generateUUID()`: UUID v4の生成
- `generateUUIDs(count)`: 複数UUIDの生成

**helper/template.ts:**

- `replacePlaceholders()`: テンプレート内のプレースホルダー置換
- `copyTemplate()`: テンプレートディレクトリのコピーと処理
- `isDirectoryEmpty()`: ディレクトリが空かチェック
- `validateProjectName()`: プロジェクト名のバリデーション
- `projectNameToAddonName()`: プロジェクト名からアドオン名への変換

**helper/package.ts:**

- `initGit()`: Gitリポジトリの初期化
- `installDependencies()`: npm依存関係のインストール
- `detectPackageManager()`: パッケージマネージャの検出
- `updatePackageJson()`: package.jsonへの追加設定

**helper/index.ts:**

- すべてのヘルパーをエクスポート

### 4. インタラクティブプロンプトの実装 ✅

#### src/prompts.ts

**ProjectOptions インターフェース:**

- プロジェクト名
- アドオン名
- 説明
- TypeScript使用
- ESLint使用
- Prettier使用
- Git初期化

**promptProjectOptions():**

- インタラクティブなプロンプトでユーザー入力を取得
- バリデーション機能付き
- キャンセル処理対応

**displaySummary():**

- プロジェクト設定のサマリー表示

**displaySuccess():**

- プロジェクト作成成功メッセージ

### 5. メインロジックの実装 ✅

#### src/index.ts

**主要機能:**

- Commander.jsによるCLI実装
- インタラクティブモードとCLIモードの両対応
- `--yes`フラグでデフォルト値使用
- テンプレートのコピーとプレースホルダー置換
- UUIDの自動生成
- package.jsonの動的更新
- オプショナルファイルの管理（ESLint、Prettier）

**CLIオプション:**

- `[project-name]`: プロジェクト名（オプション、デフォルト: "akhsync-project"）
- `--git`: Git初期化
- `--typescript`: TypeScript使用
- `--lint`: ESLint設定
- `--prettier`: Prettier設定
- `-y, --yes`: プロンプトスキップ

### 6. Git初期化機能の実装 🔄

#### 実装状況

- `helper/package.ts`に`initGit()`関数実装済み
- メインロジックに統合済み
- ユーザー選択により初期化可能

#### 残作業

- 初回コミット機能の追加（オプション）

### 7. 設定ファイル生成機能の実装 ✅

#### 実装完了

- テンプレートREADME.mdの作成（英語・日本語）
- プロジェクトREADME.mdの作成（英語・日本語）
- すべての設定ファイルがテンプレートに含まれている

### 8. テストとドキュメント 🔄

#### 完了

- README.md作成（英語）
- README_JP.md作成（日本語）
- テンプレート内のREADME作成

#### 残タスク

- ユニットテストの作成
- E2Eテストの作成
- 使用例の追加
- トラブルシューティングガイド

## 技術スタック

- **Commander.js**: CLI フレームワーク
- **Prompts**: インタラクティブプロンプト
- **fs-extra**: ファイルシステム操作
- **chalk**: ターミナル出力の色付け
- **@vercel/ncc**: TypeScriptのバンドル
- **TypeScript**: 型安全な開発

## ビルド設定

- **ncc**: 単一ファイルバンドル
- **watch mode**: 開発時の自動リビルド
- **minify**: 本番ビルドの最小化

## 次のステップ

### ビルドとテスト

1. 依存関係のインストール:

    ```bash
    cd packages/create-akhsync
    npm install
    ```

2. 開発ビルド（ウォッチモード）:

    ```bash
    npm run dev
    ```

3. 本番ビルド:

    ```bash
    npm run build
    ```

4. ローカルテスト:
    ```bash
    node dist/index.js my-test-project
    ```

### 公開前のチェックリスト

- [ ] すべての依存関係がインストールされている
- [ ] ビルドがエラーなく完了する
- [ ] テンプレートファイルがすべて存在する
- [ ] ローカルでプロジェクト作成が成功する
- [ ] 生成されたプロジェクトがビルドできる
- [ ] 生成されたプロジェクトでakhsyncコマンドが動作する

---

_最終更新: 2025-11-18_
