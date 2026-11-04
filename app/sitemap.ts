import type { MetadataRoute } from 'next';
import { writeups } from '@/data/writeups';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return [{url:'https://blimmy.github.io/',priority:1},...writeups.filter(w=>w.visible&&w.status==='published').map(w=>({url:`https://blimmy.github.io/research/${w.slug}/`,priority:.7}))]}
