# akhsync

[![GitHub license](https://img.shields.io/github/license/AKHstudio/akh_file_sync.svg)](https://github.com/AKHstudio/akh_file_sync/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@akhstudio/akhsync.svg)](https://www.npmjs.com/package/@akhstudio/akhsync/v/latest)
[![npm downloads](https://img.shields.io/npm/dt/@akhstudio/akhsync.svg)](https://www.npmjs.com/package/@akhstudio/akhsync)

## what is akhsync?

AKHStudio が作成した minecraft の統合版のアドオンを開発するためのライブラリです。

コマンドの正確なドキュメントはGitHub Wikiにあります。

[ドキュメントはこちら](https://github.com/AKHstudio/akh_file_sync/wiki)

## インストール

すでにプロジェクトが初期化されている場合は、以下のコマンドで `akhsync` をインストールできます。

```sh
npm install @akhstudio/akhsync@latest --save-dev
```

> [!NOTE]
>
> `-g` オプションを使用すると、グローバルにインストールされ直接 `akhsync` コマンドを使用できるようになります。

> [!IMPORTANT]
> グローバルにインストールする場合は、プロジェクトのディレクトリ構成に注意してください。

```sh
npm install -g @akhstudio/akhsync@latest
```

## 始め方

### 1. npmを初期化

```sh
npm init your_project_name -y
```

### 2. ファイル構成を作成

開発するアドオンプロジェクトのルートディレクトリ構成は以下のようにします。

```
your_project_root
    |-- src/ (開発用ソースコード)
        |-- addon1/
            |-- behavior_packs/
            |   |-- scripts/
            |       |-- main.js
            |-- resource_packs/
        |-- addon2/ (複数アドオンを開発する場合　※任意)
            |-- behavior_packs/
            |   |-- scripts/
            |       |-- main.ts
            |-- resource_packs/
    |-- world/ (ビルド用ワールドデータ　※任意)
    |-- tsconfig.json (TypeScriptを使う場合のみ)
    |-- package.json
```

### 3. 必要ライブラリをインストール

`@minecraft` ライブラリは、使用したいバーションに合わせてインストールしてください。

[バージョン一覧 - @minecraft/server](https://www.npmjs.com/package/@minecraft/server?activeTab=versions)

[バージョン一覧 - @minecraft/server-ui](https://www.npmjs.com/package/@minecraft/server-ui?activeTab=versions)

以下は最新の安定バージョンをインストールする例です。

#### akhsync

```sh
npm install @akhstudio/akhsync@latest --save-dev
```

#### @minecraft/server

```sh
npm install @minecraft/server@latest --save-dev
```

#### @minecraft/server-ui (※UIを使う場合)

```sh
npm install @minecraft/server-ui@latest --save-dev
```

### 3.1 TypeScriptを使う場合はtsconfig.jsonを作成 (※任意)

> [!IMPORTANT]
>
> - TypeScriptを使わない場合はこのステップは不要です。

> [!NOTE]
>
> - `@minecraft/math`モジュールを使用する場合は、`paths`オプションを適宜変更してください。
> - 以下の設定は一例です。プロジェクトに合わせて調整してください。

```json title="tsconfig.json"
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "esnext",
        "moduleResolution": "bundler",
        "baseUrl": "./",
        "paths": {
            "@minecraft/math": ["node_modules/@minecraft/math/dist/minecraft-math.d.ts"]
        },
        "resolvePackageJsonImports": true,
        "allowJs": true,
        "noEmit": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true
    },
    "include": ["**/scripts/**/*"],
    "exclude": ["node_modules", "build", "dist"]
}
```

### 4. package.jsonにスクリプトを追加

```json title="package.json"
{
    "scripts": {
        "build": "akhsync build",
        "sync": "akhsync sync",
        "async": "akhsync async",
        "watch": "akhsync watch",
        "dist": "akhsync dist"
    }
}
```

> [!TIP]
>
> オプションを追加で指定したい場合は、`--` の後に続けてオプションを追加します。
>
> ```sh
> npm run build -- --development
> ```
