# akhsync ドキュメントサイト

Next.js 15で構築されたakhsyncのドキュメントサイトです。静的サイト生成(Static Site Generation)に対応しています。

## 🚀 クイックスタート

### 最速で始める方法

**Windows:**
```cmd
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

その後:
```bash
npm run dev
```

### 手動セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いて確認できます。

---

## 📋 目次

- [セットアップ](#セットアップ)
- [ビルド＆デプロイ](#ビルドデプロイ)
- [プロジェクト構造](#プロジェクト構造)
- [コンポーネント解説](#コンポーネント解説)
- [スタイリング](#スタイリング)
- [ページ構成](#ページ構成)

## セットアップ

### 必要要件

- Node.js 18.x以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて確認できます。

## ビルド＆デプロイ

### 静的サイトのビルド

```bash
npm run build
```

ビルド成果物は `out` ディレクトリに生成されます。

### プレビュー

```bash
npm run start
```

## プロジェクト構造

```
akhsync-docs/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト
│   ├── layout.module.css        # レイアウト用CSS
│   ├── globals.css              # グローバルCSS
│   ├── page.tsx                 # トップページ
│   ├── page.module.css          # トップページ用CSS
│   ├── installation/            # インストールページ
│   ├── quickstart/              # クイックスタートページ
│   └── commands/                # コマンド詳細ページ群
│       ├── commands.module.css  # コマンドページ共通CSS
│       ├── build/
│       ├── sync/
│       ├── async/
│       ├── watch/
│       └── dist/
├── components/                   # 再利用可能なコンポーネント
│   ├── Header/
│   ├── Sidebar/
│   ├── CodeBlock/
│   ├── Alert/
│   ├── NavigationButtons/
│   ├── QuickLinkCard/
│   ├── InfoBox/
│   ├── PageHeader/
│   └── ContentSection/
├── public/                       # 静的ファイル
├── next.config.ts               # Next.js設定
├── tsconfig.json                # TypeScript設定
└── package.json
```

## コンポーネント解説

### 1. Header (components/Header/)

サイト全体のヘッダーコンポーネント。

**機能:**
- ロゴ表示（グラデーション効果付き）
- ナビゲーションリンク（ホーム、GitHub、npm）
- 固定位置（position: fixed）

**使用例:**
```tsx
import Header from '@/components/Header/Header';

<Header />
```

**CSS モジュール:**
- `.header` - ヘッダーコンテナ
- `.logo` - グラデーションロゴ
- `.headerLinks` - リンクコンテナ
- `.headerLink` - 個別リンク

### 2. Sidebar (components/Sidebar/)

サイドバーナビゲーションコンポーネント。

**機能:**
- ページナビゲーション
- アクティブページのハイライト
- モバイル対応（ハンバーガーメニュー）
- オーバーレイ機能

**使用例:**
```tsx
import Sidebar from '@/components/Sidebar/Sidebar';

<Sidebar />
```

**主な状態管理:**
- `isOpen` - サイドバーの開閉状態（モバイル用）

**CSS モジュール:**
- `.sidebar` - サイドバーコンテナ
- `.navLink` - ナビゲーションリンク
- `.active` - アクティブリンク
- `.subLink` - サブリンク
- `.menuToggle` - モバイルメニューボタン

### 3. CodeBlock (components/CodeBlock/)

コードブロック表示とコピー機能を提供するコンポーネント。

**機能:**
- シンタックスハイライト対応
- コピーボタン
- 言語表示
- スクロール対応

**Props:**
```typescript
interface CodeBlockProps {
  code: string;      // 表示するコード（HTML可）
  lang?: string;     // 言語名（デフォルト: 'code'）
}
```

**使用例:**
```tsx
import CodeBlock from '@/components/CodeBlock/CodeBlock';

<CodeBlock 
  code='<span class="command">npm install akhsync</span>' 
  lang="bash" 
/>
```

**CSS モジュール:**
- `.codeBlock` - コードブロックコンテナ
- `.codeHeader` - ヘッダー（言語名とコピーボタン）
- `.copyButton` - コピーボタン
- `.copied` - コピー成功時のスタイル

### 4. Alert (components/Alert/)

情報、警告、ヒントなどを表示するアラートボックス。

**機能:**
- 4つのタイプ（note、important、tip、warning）
- タイトルとコンテンツ
- 視覚的な区別

**Props:**
```typescript
interface AlertProps {
  type: 'note' | 'important' | 'tip' | 'warning';
  title: string;
  children: ReactNode;
}
```

**使用例:**
```tsx
import Alert from '@/components/Alert/Alert';

<Alert type="note" title="📌 NOTE">
  <p>これは注意事項です。</p>
</Alert>
```

**CSS モジュール:**
- `.alert` - アラートコンテナ
- `.note`, `.important`, `.tip`, `.warning` - タイプ別スタイル
- `.alertTitle` - タイトル
- `.alertContent` - コンテンツ

### 5. NavigationButtons (components/NavigationButtons/)

前へ/次へのページナビゲーションボタン。

**機能:**
- 前ページ・次ページへのリンク
- ラベルとタイトル表示
- レスポンシブ対応

**Props:**
```typescript
interface NavigationButtonsProps {
  prev?: {
    href: string;
    label: string;
    title: string;
  };
  next?: {
    href: string;
    label: string;
    title: string;
  };
}
```

**使用例:**
```tsx
import NavigationButtons from '@/components/NavigationButtons/NavigationButtons';

<NavigationButtons
  prev={{
    href: '/installation',
    label: '← 前へ',
    title: 'インストール',
  }}
  next={{
    href: '/quickstart',
    label: '次へ →',
    title: 'クイックスタート',
  }}
/>
```

**CSS モジュール:**
- `.navigationButtons` - ボタンコンテナ
- `.navButton` - 個別ボタン
- `.next` - 次へボタンの右寄せ

### 6. QuickLinkCard (components/QuickLinkCard/)

クイックリンク用のカード型コンポーネント。

**機能:**
- 内部リンクと外部リンクに対応
- ホバーエフェクト
- タイトルと説明表示

**Props:**
```typescript
interface QuickLinkCardProps {
  href: string;
  title: string;
  description: string;
  external?: boolean;  // 外部リンクの場合true
}
```

**使用例:**
```tsx
import QuickLinkCard from '@/components/QuickLinkCard/QuickLinkCard';

<QuickLinkCard
  href="/installation"
  title="📦 インストール"
  description="akhsyncの導入方法"
/>
```

**CSS モジュール:**
- `.card` - カードコンテナ
- `.title` - カードタイトル
- `.description` - カード説明

### 7. InfoBox (components/InfoBox/)

情報ボックスコンポーネント。

**機能:**
- グラデーション背景
- 左側のボーダー
- 強調表示

**Props:**
```typescript
interface InfoBoxProps {
  children: ReactNode;
}
```

**使用例:**
```tsx
import InfoBox from '@/components/InfoBox/InfoBox';

<InfoBox>
  <p><strong>🚀 重要情報</strong><br />
  ここに重要な情報を記載します。</p>
</InfoBox>
```

**CSS モジュール:**
- `.infoBox` - ボックスコンテナ

### 8. PageHeader (components/PageHeader/)

ページヘッダーコンポーネント。

**機能:**
- ヒーローセクション表示
- タイトルと説明
- グラデーション背景

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  description: string;
  isHero?: boolean;  // ヒーロー表示の場合true
}
```

**使用例:**
```tsx
import PageHeader from '@/components/PageHeader/PageHeader';

<PageHeader
  title="📦 インストール方法"
  description="akhsyncをプロジェクトに導入する方法"
/>
```

**CSS モジュール:**
- `.hero` - ヒーロースタイル
- `.pageHeader` - 通常ページヘッダー

### 9. ContentSection (components/ContentSection/)

コンテンツセクションのラッパーコンポーネント。

**機能:**
- セクションのグループ化
- 統一されたスタイリング
- IDによるアンカーリンク対応

**Props:**
```typescript
interface ContentSectionProps {
  children: ReactNode;
  id?: string;  // アンカーリンク用ID
}
```

**使用例:**
```tsx
import ContentSection from '@/components/ContentSection/ContentSection';

<ContentSection id="installation">
  <h2>インストール方法</h2>
  <p>内容...</p>
</ContentSection>
```

**CSS モジュール:**
- `.contentSection` - セクションコンテナ

## スタイリング

### グローバルCSS (app/globals.css)

**CSS変数:**
```css
:root {
  --primary-color: #10b981;
  --primary-dark: #059669;
  --secondary-color: #3b82f6;
  --bg-color: #ffffff;
  --bg-secondary: #f8fafc;
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --sidebar-width: 280px;
  --header-height: 70px;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
```

### CSS モジュール

各コンポーネントは独自の`.module.css`ファイルを持ち、スコープが限定されています。

**命名規則:**
- BEM風の命名を採用
- キャメルケースを使用
- セマンティックな名前付け

## ページ構成

### トップページ (app/page.tsx)
- ヒーローセクション
- Welcome セクション
- 機能紹介
- クイックリンク
- コマンド一覧
- リソースリンク

### インストールページ (app/installation/page.tsx)
- プロジェクトへのインストール
- グローバルインストール
- インストール方法の選択

### クイックスタートページ (app/quickstart/page.tsx)
- npm初期化
- ファイル構造
- ライブラリインストール
- package.json設定

### コマンドページ (app/commands/*/page.tsx)
各コマンド(build, sync, async, watch, dist)について:
- 概要
- 使用方法
- 引数とオプション
- 使用例
- よくある使用例

## 開発のヒント

### 新しいページの追加

1. `app/`ディレクトリに新しいフォルダを作成
2. `page.tsx`ファイルを作成
3. 必要に応じて`[page-name].module.css`を作成
4. `components/Sidebar/Sidebar.tsx`にナビゲーションリンクを追加

### 新しいコンポーネントの追加

1. `components/`に新しいフォルダを作成
2. `ComponentName.tsx`と`ComponentName.module.css`を作成
3. 必要に応じてREADMEのコンポーネント解説セクションを更新

### スタイリングのベストプラクティス

- CSS変数を活用する
- CSS Modulesでスコープを限定する
- レスポンシブデザインを考慮する（モバイルファースト）
- 一貫したスペーシングを使用する

## ライセンス

このプロジェクトは元のakhsyncプロジェクトと同じライセンスに従います。

## リンク

- [akhsync GitHub](https://github.com/AKHstudio/akh_file_sync)
- [akhsync npm](https://www.npmjs.com/package/@akhstudio/akhsync)
- [Next.js Documentation](https://nextjs.org/docs)

## トラブルシューティング

### エラー: `Module not found: Can't resolve './page.module.css'`

**原因:** ファイルが正しく配置されていないか、キャッシュの問題です。

**解決方法:**

1. `.next`ディレクトリを削除してキャッシュをクリア:
```bash
rm -rf .next
# Windowsの場合
rmdir /s /q .next
```

2. node_modulesを再インストール:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. 開発サーバーを再起動:
```bash
npm run dev
```

### 警告: `Next.js inferred your workspace root`

**原因:** プロジェクトが別のプロジェクト内にネストされています。

**解決方法:** 

この警告は無視しても問題ありませんが、解消したい場合は:

1. プロジェクトを親ディレクトリから独立した場所に移動する
2. または、`next.config.ts`の`outputFileTracingRoot`設定を確認する（既に設定済み）

### ビルドエラー

ビルド時にエラーが発生する場合:

```bash
# キャッシュをクリア
npm run build -- --no-cache

# または完全にクリーンアップ
rm -rf .next out node_modules
npm install
npm run build
```

### ポート3000が使用中

別のアプリケーションがポート3000を使用している場合:

```bash
# 別のポートで起動
npm run dev -- -p 3001
```
