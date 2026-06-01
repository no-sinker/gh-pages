# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

株式会社ノーシンカー（no-sinker.co.jp）のHugo静的サイト。このリポジトリはソース管理用で、`master`へのプッシュをトリガーにGitHub Actionsがビルドし、出力を別リポジトリ `no-sinker/no-sinker.github.io` へコミット・プッシュする。

## コマンド

```bash
hugo server          # ローカル開発サーバー（ライブリロード、http://localhost:1313）
hugo                 # 本番ビルド → public/ に出力
```

CIで使用しているHugoバージョンは `0.71.1 extended`。

## Dockerを使ったローカル確認

CIと同一の Hugo 0.71.1 extended 環境で確認する場合は Docker を使用する。

### 初回セットアップ（イメージビルド）

```bash
docker build -t hugo-0.71.1 .
```

### 開発サーバー起動（ライブリロード）

```bash
docker run --rm -v $(pwd):/site -p 1313:1313 hugo-0.71.1
```

起動後、http://localhost:1313 でプレビュー確認できる。`content/` や `layouts/` を編集すると自動でリロードされる。

### サーバー停止

```bash
docker stop $(docker ps -q --filter ancestor=hugo-0.71.1)
```

### 本番ビルド確認

```bash
docker run --rm -v $(pwd):/site hugo-0.71.1 hugo
```

`public/` に出力される。

### 備考

- `Dockerfile` の `FROM --platform=linux/amd64` は Apple Silicon (ARM64) 上で x86_64 の Hugo バイナリを動かすための指定。
- 起動時の `WARN: found no layout file for "taxonomyTerm"` は既存の警告で無害。

## アーキテクチャ

```
config.toml          # サイト設定（baseURL、タイトル、params）
content/             # TOMLフロントマターつきMarkdownコンテンツ
  about/             # 会社概要
  business/          # 事業内容
  contact/           # お問い合わせ
  privacy-policy/    # Privacy Policy
layouts/
  index.html         # トップページテンプレート
  partials/          # head、header、footer、js、socialの共通パーシャル
  section/           # セクションごとのページテンプレート
static/
  css/local.css      # 独自スタイルシート（グリーンアクセントのテーマ）
  img/, image/       # コンテンツやCSSから参照する画像
```

## 重要事項

- **コンテンツ編集**: `content/<section>/_index.md` を編集する。フロントマターはTOML形式（`+++ ... +++`）。
- **スタイリング**: `static/css/local.css` が唯一のカスタムスタイルシート（`config.toml` の `custom_css` で読み込み）。セクション見出し（`h2`、`h3`、`h4`）のグリーン配色もここで定義。
- **お問い合わせフォーム**: `layouts/section/contact.html` にインラインJavaScriptがあり、Azure Functionsエンドポイント（`no-sinker-001-sample.azurewebsites.net`）へPOSTする。APIキーはそのファイルに埋め込まれている。
- **デプロイ**: `master` へのプッシュで `.github/workflows/deploy.yml` が起動し、`hugo` を実行後、`public/` の内容を `MY_GITHUB_ACCESS_TOKEN` を使って `no-sinker/no-sinker.github.io` へ直接コミット・プッシュする。
- **ビルドツールチェーン不要**: npm/nodeは使用しない。Hugoのみで完結しており、前処理・後処理のステップはない。
