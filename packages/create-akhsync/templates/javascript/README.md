# {{PROJECT_NAME}}

{{ADDON_DESCRIPTION}}

## 🚀 はじめに

このプロジェクトは [create-akhsync](https://github.com/AKHstudio/akh_file_sync/tree/main/packages/create-akhsync) を使用して作成されました。

### 必要要件

- Node.js 20.11.1以上
- Minecraft統合版

### インストール

依存関係をインストール:

```bash
npm install
```

## 📦 利用可能なスクリプト

### `npm run build`

本番用にアドオンをビルドします。JavaScriptにコンパイルし、アドオンをバンドルします。

### `npm run watch`

開発用のウォッチモード。変更を加えると自動的にリビルドされます。

### `npm run sync`

ビルドしたアドオンをMinecraftの開発フォルダに同期します。

### `npm run async`

Minecraftへの非同期同期。

### `npm run dist`

アドオンの配布パッケージを作成します。

### `npm run lint`

コードのリントエラーをチェックします。

### `npm run lint:fix`

リントエラーを自動修正します。

### `npm run format`

コードフォーマットをチェックします。

### `npm run format:fix`

コードフォーマットを自動修正します。

## 📁 プロジェクト構造

```
{{PROJECT_NAME}}/
├── src/
│   └── {{ADDON_NAME}}/
│       ├── behavior_packs/
│       │   ├── manifest.json
│       │   └── scripts/
│       │       └── main.js
│       └── resource_packs/
│           └── manifest.json
├── akhsync.config.js
├── package.json
└── README.md
```

## 🔧 設定

### Akhsync設定

`akhsync.config.js` を編集してビルドプロセスをカスタマイズ:

```javascript
const config = {
    // ここに設定を追加
};

export default config;
```

## 📝 開発

1. `src/{{ADDON_NAME}}/behavior_packs/scripts/` でアドオンスクリプトを編集
2. `npm run watch` を実行して開発モードを開始
3. 変更は自動的にリビルドされ、Minecraftに同期されます

## 🎮 テスト

1. アドオンをビルド: `npm run build`
2. Minecraftに同期: `npm run sync`
3. Minecraftを起動してワールドを読み込む
4. ゲーム内でアドオンをテスト

## 📚 リソース

- [Akhsyncドキュメント](https://akhstudio.github.io/akh_file_sync/)
- [Minecraft統合版ドキュメント](https://learn.microsoft.com/ja-jp/minecraft/creator/)
- [@minecraft/server API](https://learn.microsoft.com/ja-jp/minecraft/creator/scriptapi/minecraft/server/minecraft-server)

## 🤝 コントリビューション

コントリビューションを歓迎します！お気軽にPull Requestを送信してください。

## 📄 ライセンス

このプロジェクトはISCライセンスの下でライセンスされています。

## 👤 作者

あなたの名前

---

楽しいコーディングを！ 🎮✨
