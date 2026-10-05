# My Site (Astro)

白黒(グレーなし)のダークモード付き、記事投稿用の静的サイトです。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的ファイルを出力
npm run preview  # ビルド結果の確認
```

## 最初に書き換えるところ

| 場所 | 内容 |
| --- | --- |
| `src/config.ts` | サイト名・説明・デフォルトの投稿者 |
| `src/data/top.ts` | TOPページの画像と文章 |
| `src/data/links.ts` | リンク集とバナー(TOPの端にも出ます) |
| `public/icon.svg` | サイトアイコン(ヘッダー左上。サイト名と同じくクリックでTOPへ) |
| `public/ogp.png` | リンクを共有したときに出るサイトのプレビュー画像(1200×630のPNG/JPEG) |
| `public/images/` `public/banners/` | 画像・バナー |
| `astro.config.mjs` の `site` | 公開URL(GitHub Pagesなら `https://<ユーザー名>.github.io`) |

## ページ構成

- `/` TOP: 画像・文章・固定記事(PINNED)・端のリンク集
- `/posts/` 記事一覧(検索、新しい順/古い順、リスト/ブロック表示)
- `/tags/` タグ一覧、`/links/` リンク集

## 記事の書き方

`src/content/posts/` に `.md` を置くだけです。ファイル名がURLになります(`hello-world.md` → `/posts/hello-world/`)。

```md
---
title: 記事タイトル
date: 2026-10-05
author: 投稿者名        # 省略すると config.ts の名前
tags: [タグ1, タグ2]
thumbnail: /images/foo.png   # public/images/ に置いた画像。省略可
pinned: true            # TOPの固定記事に表示
draft: true             # true の記事は本番ビルドに出ない
---
```

使える記法: 見出し・太字・斜体・取り消し線・リスト・表・コード・引用(`>`)・脚注(`[^1]`)・画像・折りたたみ・文中の小さな画像。

- **画像の脚注**: `![代替テキスト](/images/a.png "ここが画像の下に出る")`
- **画像の拡大**: 記事内の画像をクリックすると拡大表示されます(何も書く必要はありません)
- **文中の小さな画像**: `public/emoji/smile.png` を置くと、本文に `:smile:` と書いて文字サイズで入れられます。
  対応形式は png / gif / webp / jpg / svg。画像のない名前(`12:30:45` など)はそのまま文字として残ります。
- **折りたたみ**: `<details><summary>見出し</summary>` + 空行 + 中身 + 空行 + `</details>`
  (`<summary>` の直後と `</details>` の直前に空行を入れると、中でMarkdownが使えます)

## 動画・ツイートの埋め込み

本文に **URLだけの行**(前後に空行)を書くと、次のサービスは自動で埋め込みになります。

```md
https://www.youtube.com/watch?v=動画ID      (youtu.be の短縮URL、?t=90 の開始秒も可)

https://www.nicovideo.jp/watch/sm9          (nico.ms の短縮URLも可)

https://x.com/ユーザー名/status/数字         (twitter.com のURLも可)
```

- `[文字](URL)` のように文字を付けたリンクは、埋め込みにならず普通のリンクのままです。
- YouTubeは `youtube-nocookie.com`(プライバシー強化モード)で埋め込みます。
- Xの埋め込みは、X公式のスクリプト(`platform.twitter.com`)を、その記事を開いたときだけ読み込みます。
  X側の仕様変更で表示されなくなることがあります。テーマ(白/黒)は読み込み時のものが使われます。
- ニコニコの埋め込みは、会員限定・有料の動画だと表示されません。

## 画像について

画像は SVG でなくても、**PNG / JPEG / WebP / GIF** をそのまま使えます(`public/images/` に置いて `/images/ファイル名` で指定)。

| 用途 | 目安 | 備考 |
| --- | --- | --- |
| TOPの大きな画像 | 横1600px前後 | 表示枠の比率は `src/data/top.ts` の `heroRatio`(標準 16:7) |
| 記事のサムネイル | 800×500(16:10) | 一覧のカードは16:10の枠に合わせて切り取られる |
| リンクプレビュー | 1200×630 | **PNG/JPEG推奨**。SVGは表示されない |
| 記事内の画像 | 横1600px以下 | 大きい写真は縮小・圧縮してから置くと速い |

- 枠の比率と画像の比率が違うと、はみ出た部分が**切り取られます**(縮んだり歪んだりはしません)。
  どこが見えるかを自分で決めたいときは、最初から枠の比率に切り抜いておくのが確実です。
  切り抜きたくないときは、TOP画像は `heroRatio: 'auto'` にすると画像そのままの比率で出ます。
- 切り取る位置は `heroPosition`(`'top'` や `'50% 20%'` など)でも調整できます。
- 絵文字用の画像(`public/emoji/`)は、正方形に近い小さな画像(64×64程度)が向いています。

## リンクプレビュー(Discord・Xなど)

リンクを貼ったときの画像・タイトル・説明が出るように、全ページにOGPのタグが入っています。

- **サイト(TOPなど)**: `public/ogp.png`(1200×630)が使われます。差し替えるだけで変わります。
- **記事**: 記事の `thumbnail` が PNG/JPEG/WebP/GIF なら、それがプレビュー画像になります。
  SVGや未指定のときは `ogp.png` になります。タイトルは記事タイトル、説明は本文の冒頭です。
- 公開サイトのURL(`astro.config.mjs` の `site`)が正しくないと、プレビューは出ません。
- Discordなどは一度取得した内容を**キャッシュ**します。画像を変えても古いままのときは、時間をおくか、
  URLの末尾に `?v=2` のような文字を付けて貼り直すと確認できます。

## サイト内検索

ビルド時に `/search-index.json`(全記事の本文入り)を生成し、検索ボックスに入力したときに読み込んで絞り込みます。
日本語もそのまま部分一致で検索できます。記事が数百本を超えて重くなったら Pagefind への置き換えを検討してください。

## GitHub Pages で公開する

1. GitHubで、リポジトリ名を **`<ユーザー名>.github.io`** にして作成する(この名前なら `base` の設定が不要)
2. このフォルダをそのリポジトリに push する(ブランチは `main`)
3. リポジトリの **Settings → Pages → Source** を **GitHub Actions** にする
4. push すると `.github/workflows/deploy.yml` が自動でビルドして公開する(数分かかる)

`https://<ユーザー名>.github.io/` で見られます。`astro.config.mjs` の `site` が自分のユーザー名になっているか確認してください。

- **別の名前のリポジトリ(プロジェクトサイト)にしたい場合**: `site` はそのままで `base: '/リポジトリ名'` を追加し、
  コード内の `/posts/` や `/images/…` など先頭が `/` のパスすべてに `base` を付ける作業が必要です(このテンプレートは未対応)。
- **独自ドメインを使う場合**: `public/CNAME` にドメインを1行で書き、`site` をそのドメインに変え、DNSを設定します。
