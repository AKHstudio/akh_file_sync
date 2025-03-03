# akhsync

[![GitHub license](https://img.shields.io/github/license/AKHstudio/akh_file_sync.svg)](https://github.com/AKHstudio/akh_file_sync/blob/main/LICENSE)

AKHStudio が作成した mainecraft の統合版のアドオンを開発するためのライブラリです。

## 使い方

### 目次

-   [akhsync](#akhsync)
    -   [使い方](#使い方)
        -   [目次](#目次)
        -   [インストール](#インストール)
    -   [コマンド](#コマンド)
        -   [build](#build)
            -   [オプション](#オプション)
            -   [例](#例)
        -   [sync](#sync)
            -   [オプション](#オプション-1)
            -   [例](#例-1)
        -   [async](#async)
            -   [例](#例-2)
        -   [watch](#watch)
            -   [オプション](#オプション-2)
            -   [例](#例-3)
        -   [dist](#dist)
            -   [オプション](#オプション-3)
            -   [例](#例-4)

### インストール

```sh
npm install akhsync@latest --save-dev
```

## コマンド

### build

-   `src`ディレクトリ内のファイルを`build`ディレクトリにコピーします。
-   `behavior_packs`ディレクトリ内の`scripts`ディレクトリ内のファイル(`*.js, *.ts`)を`esbuild`でビルドして`build`ディレクトリにコピーします。

#### オプション

-   -d , --development 開発用ビルド (圧縮なし)
-   -o , --only behavior, resource のどれかを指定して、それだけビルドする

#### 例

```sh
npx akhsync build --development
```

### sync

-   開発しているアドオンプロジェクトをビルドして、`development_*_packs` に同期する

#### オプション

-   --no-build : ビルドをスキップする
    -   ビルドしたものが存在しない場合はエラー
-   `build` コマンドのオプション

#### 例

```sh
npx akhsync sync --no-build
```

### async

-   同期を解除する (`development_*_packs` から削除する) - `sync` コマンドで同期されたものを元に戻す

#### 例

```sh
npx akhsync async
```

### watch

-   `src`内の変更を監視し、`build`, `sync`を実行します。

#### オプション

-   `build` コマンドのオプション

#### 例

```sh
npm run watch -d
```

### dist

-   リリース用ビルドを行う
    -   ビルドの結果は `./dist` ディレクトリに出力される
    -   バージョンは `package.json` or オプションから取得する
    -   名前は `ディレクトリ名-バージョン` とする

#### オプション

-   -t , --type : world , addon から複数選択可能
-   --set-version : バージョンを指定する
-   --set-world-name : ワールド名を指定する
    -   {name} でディレクトリ名を指定できる
    -   {version} でバージョンを指定できる
    -   例: "test-{version}" で `test-1.0.0` となる

#### 例

```sh
npx akhsync dist -t world --set-version 1.0.0　--set-world-name "{name}-{version}"
```
