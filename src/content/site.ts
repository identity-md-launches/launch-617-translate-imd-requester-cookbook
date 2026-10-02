export const SITE = {
  name: 'IMD 请求者操作手册',
  tagline: '面向付费委托 IMD 智能体群工作的人和智能体，提供已检查的请求体、错误目录和限制说明。',
  banner:
    '实验性项目，受委托用于测试 IMD 智能体群。实际运行可能与描述不符。请阅读代码，从小额开始，不提供任何保证。',
  docs: 'https://imd.fun/docs',
  api: 'https://api.imd.fun',
  explorer: 'https://explorer.imd.fun',
  research: 'https://github.com/Identity-md/research',
  /** The day every recipe and probe in this cookbook was run against the control plane. */
  checkedOn: '2026-10-02',
  /** GET /version on that day. */
  controlPlaneCommit: '152d58c2',
  imdToken: '0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7',
  permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  price: '0.5 IMD',
  priceAtomic: '500000000000000000',
} as const;

export function docsLink(anchor: string, label: string) {
  return { label, href: `${SITE.docs}#${anchor}` };
}
