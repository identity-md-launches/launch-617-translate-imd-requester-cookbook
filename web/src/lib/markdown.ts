// Serialises the content model to plain Markdown for llms.txt and llms-full.txt.
// Used by scripts/gen-llms.mjs (Node, type-stripped) and by the tests.
import { englishPage } from '../content/english.ts';
import type { Block, ErrorEntry, Page, Recipe } from '../content/types.ts';
import { SITE, errors, limits, nav, recipes, research, start, glossary } from '../content/index.ts';

function blockToMd(b: Block): string {
  switch (b.kind) {
    case 'p':
      return b.text;
    case 'ul':
      return b.items.map((i) => `- ${i}`).join('\n');
    case 'ol':
      return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n');
    case 'code':
      return `${b.title ? `${b.title}:\n\n` : ''}\`\`\`${b.lang}\n${b.code}\n\`\`\``;
    case 'table':
      return [
        `| ${b.head.join(' | ')} |`,
        `| ${b.head.map(() => '---').join(' | ')} |`,
        ...b.rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`),
      ].join('\n');
    case 'note':
      return `> **${b.title}.** ${b.text}`;
  }
}

function pageLinks(slug: string): string {
  return `[${slug === 'glossary' ? '英文版站点' : '英文原页'}](${englishPage(slug)}) · [IMD 文档](${SITE.docs}) · [术语表](#/glossary)`;
}

function docsLines(p: Page): string {
  return `对应文档： ${p.docs.map((d) => `[${d.label}](${d.href})`).join('、')}\n\n${pageLinks(p.slug)}`;
}

export function pageToMd(p: Page): string {
  const out: string[] = [`# ${p.title}`, '', p.lead, '', docsLines(p), ''];
  for (const s of p.sections) {
    out.push(`## ${s.title}`, '');
    for (const b of s.blocks) out.push(blockToMd(b), '');
  }
  return out.join('\n').trimEnd() + '\n';
}

export function recipeToMd(r: Recipe): string {
  const out: string[] = [
    `# ${r.title}`,
    '',
    r.lead,
    '',
    `操作：\`${r.action}\` · 版本 \`${r.version}\` · 价格 ${r.price} · 检查日期 ${r.checkedOn}，控制平面 \`${SITE.controlPlaneCommit}\``,
    '',
    docsLines(r),
    '',
  ];
  if (r.checkBody) {
    out.push('## 发送至 POST /requests/check 的请求体', '', '```json', JSON.stringify(r.checkBody, null, 2), '```', '');
    out.push('## 发送至 POST /requests/quote 的请求体', '');
  } else {
    out.push('## 通过检查的请求体', '');
  }
  out.push('```json', JSON.stringify({ action: r.action, input: r.body }, null, 2), '```', '');
  out.push('## 检查结果', '', r.checkResult, '');
  for (const s of r.sections) {
    out.push(`## ${s.title}`, '');
    for (const b of s.blocks) out.push(blockToMd(b), '');
  }
  return out.join('\n').trimEnd() + '\n';
}

function errorToMd(e: ErrorEntry): string {
  return [
    `### ${e.code}`,
    '',
    `阶段：${({check: '检查或报价', quote: '报价', submit: '提交', read: '公开读取', run: '运行'})[e.where]} · ${e.status}`,
    '',
    `原因：${e.cause}`,
    '',
    `修复：${e.fix}`,
    '',
    `观察记录：${e.observed}`,
    '',
    `文档：${SITE.docs}#${e.docs}`,
  ].join('\n');
}

export function errorsToMd(): string {
  const req = errors.filter((e) => e.required);
  const rest = errors.filter((e) => !e.required);
  return [
    '# 错误目录', '', pageLinks('errors'),
    '',
    `列出请求者可能遇到的拒绝码、原因和修复方法。于 ${SITE.checkedOn} 通过免费检查和公开读取探测；需要付款才会出现的代码明确注明未复现。`,
    '',
    `对应文档： [错误](${SITE.docs}#errors), [付费请求的错误与限制](${SITE.docs}#paid)`,
    '',
    '## 原任务指定的错误码',
    '',
    req.map(errorToMd).join('\n\n'),
    '',
    '## 其他常见错误码',
    '',
    rest.map(errorToMd).join('\n\n'),
    '',
  ].join('\n');
}

function overviewMd(): string {
  return [
    `# ${SITE.name}`, '', pageLinks(''),
    '',
    `> ${SITE.banner}`,
    '',
    SITE.tagline,
    '',
    `本手册补充 ${SITE.docs}，每页链接对应文档章节，不重复参考文档。所有示例请求体均于 ${SITE.checkedOn} 发送至 POST /requests/check（控制平面 \`${SITE.controlPlaneCommit}\`），并标注 GET /requests/capabilities 提供的操作版本。`,
    '',
    '站点入口：index.html（哈希路由：#/start、#/job-open、#/errors 等）。机器可读文件：/llms.txt（索引）和 /llms-full.txt（全部页面）。',
    '',
  ].join('\n');
}

/** The index file: one line per page. */
export function llmsIndex(base = ''): string {
  const lines: string[] = [overviewMd(), '## 页面', ''];
  for (const g of nav) {
    for (const it of g.items) {
      if (it.slug === '') continue;
      const page = recipes.find((r) => r.slug === it.slug) ?? (it.slug === 'errors' ? null : [start, limits, research, glossary].find((p) => p.slug === it.slug));
      const lead = page ? page.lead : '各拒绝码的原因和修复方法。';
      const stamp = page && 'version' in page ? ` (${(page as Recipe).action} ${(page as Recipe).version}, 检查日期 ${(page as Recipe).checkedOn})` : '';
      lines.push(`- [${it.title}](${base}#/${it.slug}): ${lead}${stamp}`);
    }
  }
  lines.push('', '## 更多内容', '', `- [完整文本](${base}llms-full.txt): 所有页面的 Markdown 文本`, `- [IMD 文档](${SITE.docs})`, `- [研究仓库](${SITE.research})`, '');
  return lines.join('\n');
}

/** Every page as Markdown, separated by rules. */
export function llmsFull(): string {
  const parts = [overviewMd(), pageToMd(start), ...recipes.map(recipeToMd), errorsToMd(), pageToMd(limits), pageToMd(research), pageToMd(glossary)];
  return parts.join('\n---\n\n');
}
