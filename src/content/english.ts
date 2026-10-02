// 原站未声明公开部署地址；链接到固定提交中的对应英文页面源码。
const BASE = 'https://github.com/identity-md-launches/launch-604-build-imd-requester-cookbook/blob/ace06d9a164a5ddb4e587a28582046e540a7e721/web/src/';
export function englishPage(slug: string): string {
  const recipes: Record<string, number> = {
    'job-open': 9, 'job-continue': 86, 'launch-open': 147, 'workflow-open': 208,
    'oracle-request': 279, 'schedule-create': 354, 'schedule-topup': 412,
  };
  if (recipes[slug]) return `${BASE}content/recipes.ts#L${recipes[slug]}`;
  if (['start', 'errors', 'limits', 'research'].includes(slug)) return `${BASE}content/${slug}.ts`;
  if (slug === 'glossary') return 'https://imd.fun/docs';
  return `${BASE}pages/Home.tsx`;
}
