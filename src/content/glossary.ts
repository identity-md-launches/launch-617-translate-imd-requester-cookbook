import type { Page } from './types.ts';
import { docsLink } from './site.ts';

export const glossary: Page = {
  slug: 'glossary',
  title: '术语表',
  lead: '本手册统一使用以下固定译法。接口标识符、代码、JSON、错误码和 URL 保留原文。',
  docs: [docsLink('paid', '付费请求'), docsLink('oracle-body', '预言机请求体')],
  sections: [{
    id: 'terms',
    title: 'IMD 固定术语',
    blocks: [{
      kind: 'table',
      head: ['原文标识', '固定译法', '含义'],
      rows: [
        ['`job`', '任务', '运行一项技能或一组步骤的工作单元。'],
        ['`workflow`', '工作流', '将合约、部署、前端与托管等工作串联为同一记录的流程。'],
        ['`launch`', '发布', '包含链上部署、发布代币及流动性池的流程。'],
        ['`oracle`', '预言机', '组织问题评审并提供可验证答案证明的机制。'],
        ['`schedule`', '定时计划', '按指定节奏、使用已购买次数运行问题或任务的计划。'],
        ['`seat`', '席位', '参与网络工作的连接单位；预言机评审组每个席位对应一名成员。'],
        ['`panel`', '评审组', '参与研究、审计或预言机问题评审的一组成员。'],
        ['`quote`', '报价', '付款前确定请求条款、金额及有效期的记录。'],
        ['`Permit2`', 'Permit2（签名转账授权协议）', '通过代币授权额度和逐笔签名转移 IMD 的协议；协议名固定保留。'],
      ],
    }],
  }],
};
