// TOPページの画像と文章。ここを書き換えるだけで反映される。
// 固定記事(PINNED)は、記事の frontmatter に pinned: true と書くと並ぶ。

export const top = {
  // public/ 以下の画像(png / jpg / webp / gif / svg どれでもよい)
  heroImage: '/images/shino.png',
  heroAlt: 'サイトのメイン画像',
  // 画像を表示する枠の縦横比。枠に合わせて、はみ出た部分は切り取られる。
  //   '16 / 7'  … 横長(標準)   '16 / 9' … やや高め   '1 / 1' … 正方形
  //   'auto'    … 切り取らず、画像そのままの比率で表示
  heroRatio: '16 / 7',
  // 切り取るとき、画像のどこを残すか。'center'(中央) 'top' 'bottom' 'left' 'right'、
  // または '50% 20%' のように「横位置 縦位置」で指定できる。
  heroPosition: 'center',
  heading: 'ようこそ！',
  // 1要素 = 1段落
  paragraphs: [
    'ここにサイトの説明や自己紹介を書きます。',
    'OGP, icon, hero, 自己紹介, リンク, スクリプション',
  ],
};
