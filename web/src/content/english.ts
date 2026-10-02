// 英文原站使用相同的哈希路由；术语表为中文站新增页面，链接到英文站首页。
const BASE = 'https://imd-requester-cookbook.site.identitymd.eth.limo';
export function englishPage(slug: string): string {
  if (!slug || slug === 'glossary') return `${BASE}/`;
  return `${BASE}/#/${slug}`;
}
