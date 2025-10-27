## 1.0.0 - 2025-04-01

### 🚀 リリース！！

- 公開！！

## 1.0.1 - 2025-04-12

### 🐛 修正

- コマンド使用時に、 オプションを指定しない場合 のフォルダも削除されていた不具合を修正
    - この不具合を修正するために オプションを削除
    - README.md の コマンドの説明を修正

## 1.1.0 - 2025-10-06

### 🔧 変更

- `[Minor]` `build` のコンパイル処理で `@minecraft/vanilla-data` `@minecraft/math` のみをバインドするように変更
    - これによりこれまでファイルの容量が大きくなっていた問題を解決
    - `tsconfig.json` の `paths` 解決を強制的に相対パスにするように変更

### 🐛 修正

- `[Patch]` `sync` コマンドを `--only` オプション無しで実行していた場合に、 `resource_packs` のほとんどがコピーされていなかった不具合を修正

    - `sync` コマンドの `--only` オプション無しで実行した場合、`behavior_packs` と `resource_packs` の両方が同期されるように変更

- `[Patch]` `watch` コマンドで、ファイルの変更を検知した際に、連続して変更が発生した場合に処理が重複して実行される問題を修正
    - `watch` コマンドでのファイル変更検知後、一定時間の遅延を設けることで対処
    - それぞれの同期処理に対して、2000ms(2秒)の遅延を設ける仕様

## 1.1.1 - 2025-10-17

### 🐛 修正

- `[Patch]` `Minecraft Debugger` でデバック時にブレークポイントで停止しなかった不具合を修正

## 1.2.0 - 2025-10-19

### ✨ 新機能

- READMEをデフォルトで英語にし、内容を充実化

    - 日本語版READMEは として別途用意

- ドキュメントを整備

    - インストールガイドを追加
    - クイックスタートガイドを追加
    - 各コマンドのドキュメントを追加（build, sync, async, watch, dist）

## 1.2.1 - 2025-10-24

### 🐛 修正

- `[Patch]` `dist` コマンド実行時に `world` フォルダの中身を検証するよう修正

    - `level.dat` , `db` , `behavior_packs` , `resource_packs` の存在を確認

- `[Patch]` `dist` コマンド実行時にリソースパックが正しくコピーされない問題を修正
    - その他非同期処理を改善

## 1.2.2 - 2025-10-25

### 🐛 Bug Fixes

- 本来処理が止まる必要がある箇所で止まっていなかったバグを修正 [#31](https://github.com/AKHstudio/akh_file_sync/pull/31) by [@tako-dayo8](https://github.com/tako-dayo8)
### 🔧 Chore

- npm audit fix を実行し依存関係を改善 [#29](https://github.com/AKHstudio/akh_file_sync/pull/29) by [@tako-dayo8](https://github.com/tako-dayo8)

## 1.2.3 - 2025-10-27

### 🐛 Bug Fixes

- ビルドプロセスの非同期処理を修正し、build delayを削除 [#39](https://github.com/AKHstudio/akh_file_sync/pull/39) by [@tako-dayo8](https://github.com/tako-dayo8)
- 本来処理が止まる必要がある箇所で止まっていなかったバグを修正 [#31](https://github.com/AKHstudio/akh_file_sync/pull/31) by [@tako-dayo8](https://github.com/tako-dayo8)
### 🧪 Tests

- プルリクエストごとにテストを追加 [#38](https://github.com/AKHstudio/akh_file_sync/pull/38) by [@tako-dayo8](https://github.com/tako-dayo8)
### 🔧 Chore

- npm audit fix を実行し依存関係を改善 [#29](https://github.com/AKHstudio/akh_file_sync/pull/29) by [@tako-dayo8](https://github.com/tako-dayo8)
### 📝 Other Changes

- 設定ファイルを追加 syncTargetDirとworldDirNameを設定できるように [#37](https://github.com/AKHstudio/akh_file_sync/pull/37) by [@tako-dayo8](https://github.com/tako-dayo8)
