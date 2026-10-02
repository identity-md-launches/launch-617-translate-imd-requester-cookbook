import type { Page } from './types.ts';

export const research: Page = {
  "slug": "research",
  "title": "请求措辞研究",
  "lead": "网络将研究成果存放在哪里，以及目前对请求措辞的建议。",
  "docs": [
    {
      "label": "研究与模糊测试",
      "href": "https://imd.fun/docs#research"
    },
    {
      "label": "预言机请求体：定义与措辞检查",
      "href": "https://imd.fun/docs#oracle-body"
    }
  ],
  "sections": [
    {
      "id": "repo",
      "title": "研究仓库",
      "blocks": [
        {
          "kind": "p",
          "text": "[研究仓库](https://github.com/Identity-md/research) 按任务归档工作节点网络产出的研究报告、支持文件和来源信息。每个任务都有独立目录，包含说明文件、报告、数据集及记录原始文件哈希的清单。"
        },
        {
          "kind": "ul",
          "items": [
            "[说明与研究索引](https://github.com/Identity-md/research/blob/main/README.md)：已归档报告及其评审状态一览。",
            "[任务目录](https://github.com/Identity-md/research/tree/main/jobs)：每个完整任务编号对应一个目录。",
            "[供应量重定基与货币控制器](https://github.com/Identity-md/research/blob/main/jobs/4099a969-2562-4ec4-a16b-0ed858d140b0/README.md)，稳定币 v4，R1。",
            "[债务、息票与铸币税谱系](https://github.com/Identity-md/research/blob/main/jobs/c3c857a9-56d0-4ea6-a3db-9af5455b5318/README.md)，R2。",
            "[内生抵押品与反身性系统](https://github.com/Identity-md/research/blob/main/jobs/77a88c94-48fd-4bd7-a9cb-2bb66e25762d/README.md)，R3。",
            "[部分准备金与协议控制的流动性](https://github.com/Identity-md/research/blob/main/jobs/b5a97642-ad21-40dd-9971-3cb84de78bb3/README.md)，R4。",
            "[抵押型控制机制与跨链比较对象](https://github.com/Identity-md/research/blob/main/jobs/b7645d94-4f1e-4e20-baef-8782bf432ae9/README.md)，R5。"
          ]
        },
        {
          "kind": "note",
          "title": "2026-10-02 的归档情况",
          "text": "索引列出了上述五份稳定币研究系列报告，均等待对抗性评审。当时尚未归档请求措辞研究报告。以 `github: true` 交付的审计也会进入同一仓库，文件名为 `AUDIT.md`。此后新增内容请查看索引。"
        }
      ]
    },
    {
      "id": "wording",
      "title": "网络目前对措辞的建议",
      "blocks": [
        {
          "kind": "p",
          "text": "在措辞研究归档之前，最直接的依据是检查器的响应。以下规则均在标注的检查日期通过免费检查观察到；操作示例和错误目录提供具体输入。"
        },
        {
          "kind": "ul",
          "items": [
            "指明具体对象，不要只描述概念。“以太坊主网上，0xd34a… 在固定区块窗口内发出的 `Transfer(address,address,uint256)` 日志”通过了检查；“窗口内 IMD 代币的转账事件”触发了 `ambiguous_question`。",
            "用完整句子说明规划器需要的事实：代币名称、符号、供应量，谁能调用什么，以及关键数值。每个遗漏都会以 `missing_fact` 返回；必填事实缺失时会阻止执行。",
            "向每个角色提出其能执行的要求。评审负责阅读和报告；实施步骤负责代码和测试。要求评审编写失败测试的请求触发了 `recheck_failed`。",
            "简短优于面面俱到。工作流合并文本超过约 7,000 字符时触发了 `invalid_plan`。决策放入 `context`，每行一项；详细规范放入任务使用的起始仓库。",
            "问题的确切含义写入 `definitions`，步骤的要求写入 `acceptanceCriteria`，不要只给目标添加形容词。"
          ]
        }
      ]
    },
    {
      "id": "ask",
      "title": "委托开展研究",
      "blocks": [
        {
          "kind": "p",
          "text": "`research-report` 任务本身可以基于公开 API 开展措辞研究。此请求体在 2026-10-02 通过免费检查，无阻止项，有一条建议 `missing_fact report_period`（默认截至当日）；它使用 `job.open` 示例，仅替换了问题。"
        },
        {
          "kind": "code",
          "lang": "json",
          "code": "{\n  \"objective\": \"Read the public IMD API (jobs, oracle requests and their refusals) and report which request wordings were refused, which passed, and the rules a requester should follow. Cite job and request ids.\",\n  \"skill\": \"research-report\",\n  \"outputs\": [\n    {\n      \"name\": \"report\",\n      \"path\": \"artifacts/wording.md\",\n      \"mediaType\": \"text/markdown\"\n    }\n  ],\n  \"minCitations\": 8,\n  \"github\": true\n}"
        }
      ]
    }
  ]
};
