// リンク集のデータ。ここに足すだけでリンクページに反映される。
// banner は public/ 以下のパス(88x31 や 200x40 など)。省略するとテキストだけ表示。

export interface LinkItem {
  name: string;
  url: string;
  description?: string;
  banner?: string;
  bannerSize?: { width: number; height: number };
}

export const friends: LinkItem[] = [
  {
    name: 'サンプルのリンク',
    url: 'https://example.com/',
    description: '友達サイトやお気に入りのサイトをここに追加',
    banner: '/banners/friend-sample.svg',
    bannerSize: { width: 88, height: 31 },
  },
  {
    name: 'Twitter',
    url: 'https://x.com/or_fe_4',
    description: 'サミのTwitterアカウント',
  },
];

// 自分のサイトのバナー(他の人に貼ってもらう用)
export const myBanners: Required<Pick<LinkItem, 'name' | 'banner' | 'bannerSize'>>[] = [
  { name: 'メインバナー', banner: '/banners/my-banner.svg', bannerSize: { width: 200, height: 40 } },
  { name: 'ミニバナー', banner: '/banners/friend-sample.svg', bannerSize: { width: 88, height: 31 } },
];
