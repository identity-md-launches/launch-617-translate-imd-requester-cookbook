import type { Page, Recipe } from './types.ts';
import { start } from './start.ts';
import { recipes } from './recipes.ts';
import { errors } from './errors.ts';
import { limits } from './limits.ts';
import { research } from './research.ts';
import { glossary } from './glossary.ts';
import { SITE } from './site.ts';

export { SITE, start, recipes, errors, limits, research, glossary };
export type { Page, Recipe };

export interface NavGroup {
  title: string;
  items: { slug: string; title: string; short: string }[];
}

export const nav: NavGroup[] = [
  {
    title: '开始',
    items: [
      { slug: '', title: '概览', short: '概览' },
      { slug: 'start', title: start.title, short: '入门' },
    ],
  },
  {
    title: '操作示例',
    items: recipes.map((r) => ({ slug: r.slug, title: r.title, short: r.action })),
  },
  {
    title: '参考',
    items: [
      { slug: 'errors', title: '错误目录', short: '错误目录' },
      { slug: 'limits', title: limits.title, short: '限制' },
      { slug: 'research', title: research.title, short: '请求措辞研究' },
      { slug: 'glossary', title: glossary.title, short: glossary.title },
    ],
  },
];

export function findRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function findPage(slug: string): Page | undefined {
  if (slug === 'glossary') return glossary;
  if (slug === 'start') return start;
  if (slug === 'limits') return limits;
  if (slug === 'research') return research;
  return undefined;
}
