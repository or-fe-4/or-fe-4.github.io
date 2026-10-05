// サイト全体の設定。ここを書き換えるだけで名前や投稿者を変えられる。
export const SITE = {
  title: '現時点では(仮)',
  description: 'アニメにゲームが大好き！',
  author: 'サミ',
  lang: 'ja',
  // リンクを共有したときに出るプレビュー画像(public/ 以下)。
  // 必ず PNG か JPEG で、1200×630 が目安(SVGはDiscordやXで表示されません)。
  ogImage: '/wasu.png',
} as const;
