# 📖 リリースノート作成マニュアル

- by chatGPT

## 🎯 目的

changelog/ フォルダに個別のリリースノートを作成し、CHANGELOG.md に統合する

統一フォーマットを守ることで、履歴を見やすく整理する

## 📝 リリースノート作成手順

### 1️⃣ ファイルの命名規則

changelog/{バージョン}.md の形式で作成する✅ 例:

changelog/1.2.0.md

changelog/1.1.3.md

changelog/1.1.0.md

#### beta版の命名規則

changelog/{バージョン}-beta.{数字}.md の形式で作成する✅ 例:

changelog/1.2.0-beta.1.md
changelog/1.2.0-beta.2.md
changelog/1.2.0-beta.3.md

#### rc版の命名規則

changelog/{バージョン}-rc.{数字}.md の形式で作成する✅ 例:

changelog/1.2.0-rc.1.md
changelog/1.2.0-rc.2.md
changelog/1.2.0-rc.3.md

### 2️⃣ ファイルのフォーマット

## [バージョン] - YYYY-MM-DD

### 🚀 新機能

- `[Minor]` 追加した機能や改善点を記載

### 🐛 修正

- `[Patch]` 修正したバグや問題点を記載

### 🔥 破壊的変更

- `[Major]` 互換性が失われる変更を記載

✅ 記入例

## [1.2.0] - 2025-03-31

### 🚀 新機能

- `[Minor]` 設定ファイルの自動読み込み機能を追加
- `[Minor]` CLI コマンド `--help` に詳細オプションを追加

### 🐛 修正

- `[Patch]` Windows でのパス解決の問題を修正
- `[Patch]` `config.json` のパースエラー時のメッセージを改善

### 🔥 破壊的変更

- `[Major]` `config.json` のフォーマットが変更され、古いバージョンと互換性なし

# 🏗 GitHub Actions による自動統合

リリースノートを changelog/ に追加するだけで、GitHub Actions が CHANGELOG.md に統合します 🚀

手順

changelog/ フォルダに新しいバージョンの .md ファイルを作成

main ブランチにプッシュすると、自動で CHANGELOG.md が更新される

✅ 変更内容が CHANGELOG.md に統合されるため、手動編集不要！

📌 注意事項

バージョンの記載ミスを防ぐため、フォーマットを統一すること

GitHub Actions により CHANGELOG.md は自動更新されるため、直接編集しないこと

リリース前に適切なバージョン管理 (Patch / Minor / Major) を確認すること
