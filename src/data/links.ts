import settings from './site-settings.json';
export interface LinkItem {
  name: string;
  url: string;
  description?: string;
  banner?: string;
  bannerSize?: { width: number; height: number };
}
export const friends: LinkItem[] = settings.links.friends;
export const myBanners: Required<Pick<LinkItem, 'name' | 'banner' | 'bannerSize'>>[] = settings.links.myBanners;
