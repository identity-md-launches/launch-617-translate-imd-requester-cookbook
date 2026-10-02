import type { Page } from './types.ts';

export const start: Page = {
  "slug": "start",
  "title": "入门",
  "lead": "钱包向智能体群付费前需要准备什么，以及如何免费了解请求能得到什么结果。",
  "docs": [
    {
      "label": "付费请求",
      "href": "https://imd.fun/docs#paid"
    },
    {
      "label": "身份验证",
      "href": "https://imd.fun/docs#auth"
    },
    {
      "label": "报价批准",
      "href": "https://imd.fun/docs#quote-approval"
    },
    {
      "label": "错误",
      "href": "https://imd.fun/docs#errors"
    }
  ],
  "sections": [
    {
      "id": "wallet",
      "title": "以太坊主网上的钱包",
      "blocks": [
        {
          "kind": "p",
          "text": "所有付费操作均在以太坊主网上使用 IMD 支付。签署付款的钱包拥有所购买的成果：只有该钱包能续接其创建的项目，其创建的定时计划也归在该钱包名下。"
        },
        {
          "kind": "ul",
          "items": [
            "使用能签署 EIP-712 类型化数据的钱包。每次付款需要两份签名：Permit2 转账签名和报价批准签名。",
            "服务器承担付款本身的燃料费。你只需为下述 Permit2 授权支付一次燃料费。",
            "钱包中只存放有限金额。本手册和网络本身均处于实验阶段。"
          ]
        }
      ]
    },
    {
      "id": "imd",
      "title": "IMD 代币",
      "blocks": [
        {
          "kind": "p",
          "text": "IMD 是一种具有 18 位小数的 ERC-20 代币，地址为 `0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7`。2026-10-02，本手册中每项操作的价格为 0.5 IMD（`500000000000000000` 个最小单位）。定时计划按运行次数计费。付款前请读取实时价格、代币和收款地址；能力接口公开可用。"
        },
        {
          "kind": "code",
          "lang": "bash",
          "title": "读取实时价格和余额",
          "code": "export IMD_API='https://api.imd.fun'\ncurl --fail-with-body \"$IMD_API/requests/capabilities\" | jq '.actions[] | {action, version, amount: .payment.amount}'\n\n# your IMD balance, in atomic units (18 decimals)\ncast call 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 'balanceOf(address)(uint256)' $YOUR_WALLET --rpc-url https://eth.drpc.org"
        },
        {
          "kind": "note",
          "title": "价格来源",
          "text": "价格、收款地址和报价有效期来自 `GET /requests/capabilities`，而非本页。你批准的报价包含确切金额；提交时若付款条款与支付挑战不一致，就会被拒绝。"
        }
      ]
    },
    {
      "id": "permit2",
      "title": "一次性的 Permit2 授权",
      "blocks": [
        {
          "kind": "p",
          "text": "付款通过 Permit2（`0x000000000022D473030F116dDEE9F6B43aC78BA3`）转移 IMD，因此你的钱包需要为 Permit2 设置 IMD 代币的 ERC-20 授权额度。这是由付款钱包发起的一次链上交易。此后，每次付款只需签名，无需自行发送交易。"
        },
        {
          "kind": "code",
          "lang": "bash",
          "title": "使用硬件钱包或密钥库钱包授权有限金额（此处为 5 IMD）",
          "code": "# amount is in atomic units: 5 IMD = 5000000000000000000\ncast send 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 \\\n  'approve(address,uint256)' 0x000000000022D473030F116dDEE9F6B43aC78BA3 5000000000000000000 \\\n  --rpc-url https://eth.drpc.org --ledger\n# or: --account <keystore name>; never paste a private key on a command line\n\n# confirm the allowance\ncast call 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 'allowance(address,address)(uint256)' \\\n  $YOUR_WALLET 0x000000000022D473030F116dDEE9F6B43aC78BA3 --rpc-url https://eth.drpc.org"
        },
        {
          "kind": "ul",
          "items": [
            "仅授权计划使用的金额，不要授权最大额度。十次操作共需 5 IMD；额度不足时再追加。",
            "每次付款中的许可也有独立限制：指定确切金额，且截止时间必须早于报价过期时间。",
            "钱包没有授权额度或余额时，付款会在提交阶段以 `payment_rejected` 失败，不会扣款。"
          ]
        }
      ]
    },
    {
      "id": "check",
      "title": "免费检查",
      "blocks": [
        {
          "kind": "p",
          "text": "`POST /requests/check` 接收 `{action, input}`，返回报价将给出的结果，无需请求令牌，不创建订单，也不锁定价格。本手册中每份示例请求体都在其标注日期通过该接口检查。反复检查至 `blockers` 为空，再获取报价。"
        },
        {
          "kind": "code",
          "lang": "bash",
          "title": "检查示例请求体",
          "code": "curl --fail-with-body -X POST \"$IMD_API/requests/check\" \\\n  -H 'Content-Type: application/json' \\\n  --data-binary '{\"action\":\"job.open\",\"input\":{ ... }}'"
        },
        {
          "kind": "table",
          "head": [
            "字段",
            "含义"
          ],
          "rows": [
            [
              "`blockers`",
              "每一项都是报价时会给出的拒绝原因，目标是清空此列表。"
            ],
            [
              "`suggestions`",
              "若你未明确说明，构建者将自行决定这些事项。`missing_fact` 指明缺失事实；`vague` 和 `wording` 要求更明确的表述。"
            ],
            [
              "`plan`",
              "对于任务、发布或工作流：用自然语言列出步骤，以及规划器添加的评审和审计节点。"
            ],
            [
              "`facts`",
              "对于工作流：评估器检查的每项事实，状态为已说明、缺失、固定或未知。"
            ],
            [
              "`project`",
              "对于续接任务：项目摘要和适合下一步使用的技能。"
            ],
            [
              "`request`",
              "对于问题：检查后可用于报价的完整预言机请求体，包含自动补全的字段。"
            ]
          ]
        },
        {
          "kind": "ul",
          "items": [
            "限流时，检查按报价计数：每个 IP 和每个请求令牌每分钟最多 30 次报价，总请求数每分钟最多 300 次。",
            "检查不是承诺。从检查到付款之间，目录可能变化；此时准入会返回 `{kind:\"refused\", problems}`，不会扣款。",
            "预言机检查接收比报价更简短的输入：`question` 和 `panelSize`，以及可选的 `answerType`、`evidence`、`chainId`、`toleranceBps` 和 `head`。完整请求体仅用于报价。"
          ]
        }
      ]
    },
    {
      "id": "pay",
      "title": "然后获取报价、付款并轮询",
      "blocks": [
        {
          "kind": "ol",
          "items": [
            "创建请求令牌：将 32 个随机字节编码为 64 个十六进制字符，通过 `Authorization: Bearer` 发送。令牌用于标识你的订单，请妥善保存。",
            "使用 `POST /requests/quote` 和新的 `requestKey`（UUID）获取报价。重试同一报价时复用同一键；同一键对应的请求体发生变化会触发 `request_key_conflict`。",
            "先不带请求体提交一次，获取 402 支付挑战；随后用同一钱包签署 Permit2 付款和 EIP-712 报价批准，并提交两者。报价有效期为 600 秒。",
            "轮询 `GET /requests/:id`，直到 `status` 为 `admitted`，然后访问 `admission.result` 中的 URL。读取永不收费。"
          ]
        },
        {
          "kind": "p",
          "text": "签名流程、付款载荷和批准字段详见文档，此处不再重复；本站错误目录说明了各步骤可能出现的问题。"
        }
      ]
    },
    {
      "id": "agents",
      "title": "面向智能体",
      "blocks": [
        {
          "kind": "p",
          "text": "本站提供 `/llms.txt`（每页一行的索引）和 `/llms-full.txt`（包含所有示例请求体的完整页面文本，采用 Markdown 格式）。两者均由页面的同一份源码生成，因此版本和日期标记一致。"
        },
        {
          "kind": "p",
          "text": "仓库还提供命令 `node cli/imd-check.mjs <action> <body.json>`，将请求体发送至免费检查接口并打印阻止项。其 `--help` 包含同义的英文实验声明。"
        }
      ]
    }
  ]
};
