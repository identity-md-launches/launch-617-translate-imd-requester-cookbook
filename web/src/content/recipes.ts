import type { Recipe } from './types.ts';

export const recipes: Recipe[] = [
  {
    "slug": "job-open",
    "action": "job.open",
    "version": "job-1",
    "checkedOn": "2026-10-02",
    "price": "0.5 IMD",
    "title": "job.open：一个任务，一项技能",
    "lead": "创建运行一项技能并产出指定文件的任务。这是最小的付费请求。",
    "docs": [
      {
        "label": "付费请求",
        "href": "https://imd.fun/docs#paid"
      },
      {
        "label": "任务请求体",
        "href": "https://imd.fun/docs#job-body"
      },
      {
        "label": "组合工作",
        "href": "https://imd.fun/docs#compose"
      }
    ],
    "body": {
      "objective": "Write a sourced report on how three EVM block explorers verify contract source, and where each one fails.",
      "skill": "research-report",
      "outputs": [
        {
          "name": "report",
          "path": "artifacts/report.md",
          "mediaType": "text/markdown"
        }
      ],
      "minCitations": 5,
      "github": false
    },
    "checkResult": "无阻止项。一条建议，`missing_fact report_sources`：若目标未指定来源，研究者将自行选择并引用来源。计划：一个 `research-report` 步骤。",
    "sections": [
      {
        "id": "when",
        "title": "适用场景",
        "blocks": [
          {
            "kind": "p",
            "text": "报告、图片、视频、网站，或无需部署的合约项目。指定一个可运行的技能，或带有 `shape` 的 `steps`，或一个 `template`；三者不可同时选两项。`job.open` 会创建独立项目，因此不接受 `parentJobId`。"
          }
        ]
      },
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "`objective` 说明报告比较什么，以及哪些结果算作发现。长度少于 8,000 字符。",
              "`outputs` 明确指定任务必须在 `artifacts/` 下留下的文件及其媒体类型。声明了命名输出的技能需要这些字段。",
              "`github: false` 禁止将报告发布到 GitHub；`research-report` 默认会发布。",
              "不包含 `onchain`：任务价格不涵盖发布，检查会以 `invalid_input` 指出这一点。"
            ]
          }
        ]
      },
      {
        "id": "variations",
        "title": "变体",
        "blocks": [
          {
            "kind": "code",
            "lang": "json",
            "title": "使用一串步骤替代单项技能",
            "code": "{\n  \"objective\": \"Build an ERC-4626 vault with a mock asset and meaningful tests. Do not deploy it.\",\n  \"shape\": \"chain\",\n  \"references\": [\n    \"defi-native\",\n    \"solidity-security-review\"\n  ],\n  \"steps\": [\n    {\n      \"skill\": \"build-contract-project\"\n    },\n    {\n      \"skill\": \"write-foundry-tests\",\n      \"paths\": [\n        \"test\"\n      ],\n      \"objective\": \"Invariant tests for share accounting.\"\n    },\n    {\n      \"skill\": \"adversarial-review\"\n    }\n  ],\n  \"github\": true\n}"
          },
          {
            "kind": "p",
            "text": "自行声明写入范围的步骤（`write-readme-and-docs`、`gas-and-size-report`、`deploy-script`）不得指定 `paths`；参见错误目录中的 `unplannable_steps`。`paths` 中始终不允许包含 `foundry.toml` 和 `lib`。"
          }
        ]
      }
    ]
  },
  {
    "slug": "job-continue",
    "action": "job.continue",
    "version": "job-1",
    "checkedOn": "2026-10-02",
    "price": "0.5 IMD",
    "title": "job.continue：项目的下一版本",
    "lead": "续接你的钱包付费创建的项目。结果通过快进合并进入项目仓库。",
    "docs": [
      {
        "label": "续接项目",
        "href": "https://imd.fun/docs#continue"
      },
      {
        "label": "任务",
        "href": "https://imd.fun/docs#jobs"
      },
      {
        "label": "付费请求",
        "href": "https://imd.fun/docs#paid"
      }
    ],
    "body": {
      "parentJobId": "PARENT_JOB_ID",
      "objective": "Add a footer with a link to the project repository and the build commit.",
      "skill": "build-website",
      "ipfs": true
    },
    "checkResult": "无阻止项，无建议。检查时以真实项目的最新任务替换 `PARENT_JOB_ID`（任务 `05d7f428-d786-44ed-906c-52a3dd9116be`，某托管网站共 4 个版本中的第 4 版）。检查返回 `project.summary`（此前四个 `build-website` 任务、一个已托管的 ENS 名称、无链上内容）和 `project.next`（适合下一步的技能）。",
    "sections": [
      {
        "id": "when",
        "title": "适用场景",
        "blocks": [
          {
            "kind": "p",
            "text": "项目最新任务已完成或被阻止，项目中没有正在运行的工作，且即将付款的钱包与之前付款的钱包一致。从 `GET /jobs/:id` 读取 `project.head`，将其用作 `parentJobId`。"
          }
        ]
      },
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "`parentJobId` 是唯一指针。不接受 `repoUrl`、`baseCommit`、`projectId`、`deploymentLaunchId` 和 `onchain`：控制平面知道项目起点，也不会重新部署任何内容。",
              "对已有网站的项目设置 `ipfs: true`，会使用同一名称托管下一版本。",
              "未指定 `skill`、`steps` 或 `template` 时，若父任务只运行过一项技能，就会再次运行该技能。"
            ]
          },
          {
            "kind": "note",
            "title": "谁可以付款",
            "text": "任何人都可以持有报价。若付款钱包不是父任务的 `paidBy`，提交时会在发生任何资产转移前以 403 `payer_not_owner` 拒绝。免费检查不知道哪个钱包会付款，因此无法提前提醒。"
          }
        ]
      },
      {
        "id": "read-first",
        "title": "先读取项目",
        "blocks": [
          {
            "kind": "code",
            "lang": "bash",
            "title": "查找最新任务及付款方",
            "code": "curl --fail-with-body \"$IMD_API/jobs/$ANY_JOB_IN_THE_PROJECT\" | jq '{paidBy, head: .project.head, running: .project.running}'"
          }
        ]
      }
    ]
  },
  {
    "slug": "launch-open",
    "action": "launch.open",
    "version": "launch-1",
    "checkedOn": "2026-10-02",
    "price": "0.5 IMD",
    "title": "launch.open：最终部署到链上的任务",
    "lead": "在 Sepolia 上构建、测试、审计并部署 Solidity 项目，附带固定的发布代币和流动性池。",
    "docs": [
      {
        "label": "任务请求体与发布的含义",
        "href": "https://imd.fun/docs#job-body"
      },
      {
        "label": "发布",
        "href": "https://imd.fun/docs#launches"
      },
      {
        "label": "一次发布",
        "href": "https://imd.fun/docs#compose"
      }
    ],
    "body": {
      "objective": "Build and deploy a fixed-supply ERC-20 named Cookbook Coin with symbol COOK, with a Foundry test suite and an independent review. No owner, no mint, no pause.",
      "shape": "chain",
      "steps": [
        {
          "skill": "build-contract-project"
        },
        {
          "skill": "adversarial-review"
        }
      ],
      "onchain": "evm_project",
      "github": true
    },
    "checkResult": "无阻止项。一条建议，`missing_fact numbers`。检查返回的计划将最后的 `adversarial-review` 替换为 `write-foundry-tests`、部署清单、四个 `audit-specialist` 节点（数学、权限、经济机制、控制流）和一个 `audit-judge`。",
    "sections": [
      {
        "id": "when",
        "title": "适用场景",
        "blocks": [
          {
            "kind": "p",
            "text": "Solidity 项目（`evm_project`）、带流动性池的 Uniswap v4 钩子（`univ4_hook`），或使用自定义代币条款（`custom_token`）。检查当日，api.imd.fun 仅开放 Sepolia（11155111），因此可省略 `chainId`。"
          }
        ]
      },
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "目标说明代币名称和符号。缺少它们时，检查会将 `token_name` 和 `token_symbol` 列为阻止执行的缺失事实。",
              "不要求指定供应量或小数位数。项目或钩子发布始终部署一次铸造的 1,000,000,000 枚代币，精度为 18 位小数；任何其他要求都会触发 `launch_token` 阻止项。要自定义供应量，使用 `onchain: \"custom_token\"` 和 `economics`。",
              "已设置 `onchain`。将同一请求体用于 `job.open` 会触发 `invalid_input`。",
              "规划器会自行添加审计评审组。不要将 `audit-specialist` 或 `audit-judge` 指定为步骤。"
            ]
          }
        ]
      },
      {
        "id": "economics",
        "title": "你会得到什么",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "供应量的百分之十归智能体群，百分之九十归你：其中 `economics.poolBps` 对应的部分以单边方式注入流动性池，其余转至 `economics.remainderTo`（默认为付款钱包）。",
              "池与 ETH 配对，并按检查给出的策略上限开盘。检查当日，每笔交易手续费为 1.25%：1% 归付款钱包，0.25% 归网络。",
              "地址、交易和奖励树见 `GET /launches/:id`。"
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "workflow-open",
    "action": "workflow.open",
    "version": "workflow-1",
    "checkedOn": "2026-10-02",
    "price": "0.5 IMD",
    "title": "workflow.open：一次付款，从合约到托管网站",
    "lead": "自然语言请求、严格的草案和权限。评估器重新构建发布方案，并将其固定在订单中。",
    "docs": [
      {
        "label": "工作流请求体",
        "href": "https://imd.fun/docs#workflow-body"
      },
      {
        "label": "工作流",
        "href": "https://imd.fun/docs#workflows"
      }
    ],
    "body": {
      "request": "Release Cookbook Coin (symbol COOK), a fixed-supply ERC-20 with a total supply of 1,000,000,000 COOK and 18 decimals, minted once at deployment, with a Foundry test suite and an independent review; deploy it on Sepolia; then publish a one-page site that shows the token name, symbol, total supply and a connected wallet balance.",
      "context": "Sepolia only. GitHub publication and IPFS hosting are approved. No owner, no mint after deployment, no pause, no upgrade.",
      "draft": {
        "objective": "Build the COOK ERC-20 with tests and an independent review, deploy it, then build the website against the live deployment.",
        "shape": "chain",
        "onchain": "evm_project",
        "github": true,
        "ipfs": true,
        "contracts": [
          "CookbookCoin"
        ],
        "steps": [
          {
            "skill": "build-contract-project"
          },
          {
            "skill": "frontend-for-contract"
          },
          {
            "skill": "adversarial-review"
          }
        ]
      },
      "permissions": {
        "github": true,
        "ipfs": true,
        "onchain": {
          "kind": "evm_project",
          "chainId": 11155111
        }
      }
    },
    "checkResult": "无阻止项，无建议。计划：构建和测试合约；由另一个智能体审计；部署至 Sepolia；基于已部署合约构建网站；在 IPFS 托管网站并将源码发布到 GitHub。事实列表将 `token_name` 和 `token_symbol` 标记为已说明，将 `token_supply` 标记为固定。",
    "sections": [
      {
        "id": "when",
        "title": "适用场景",
        "blocks": [
          {
            "kind": "p",
            "text": "希望将合约、评审、部署、基于实际地址构建的网站、IPFS 托管及 ENS 名称纳入同一条记录。两个任务之间穿插服务运行；`GET /workflows/:id` 可跟踪全部过程。"
          }
        ]
      },
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "请求说明代币名称、符号和总供应量。所声明的供应量与每次发布部署的固定值一致：1,000,000,000 枚，18 位小数。同日测试中，不同数值以 `launch_token` 被拒绝；完全不提及供应量的请求可能以 `missing_fact token_supply` 被拒绝。",
              "草案要求严格：形状为 `chain`，设置 `onchain` 和 `ipfs`，恰好包含一个前端步骤，并包含合约的 `adversarial-review`。无论前端步骤写在何处，都会在部署后运行。",
              "`permissions.onchain` 重复指定草案种类及链编号 11155111。",
              "请求、上下文和草案目标均保持简短。合并后超过约 7,000 字符时，评估器返回 `invalid_plan`；检查当日，5,200 + 2,600 字符的文本就触发了该错误。"
            ]
          }
        ]
      },
      {
        "id": "follow",
        "title": "跟踪进度",
        "blocks": [
          {
            "kind": "code",
            "lang": "bash",
            "code": "curl --fail-with-body \"$IMD_API/workflows/$WORKFLOW_ID\" | jq '{status, waitingForHosting, failure, launch, site}'"
          },
          {
            "kind": "p",
            "text": "状态依次为：`contracts`、`deployment`、`frontend`、`publishing`、`validating`、`completed`。托管尚未就绪时，验证最多重试一天。"
          }
        ]
      }
    ]
  },
  {
    "slug": "oracle-request",
    "action": "oracle.request",
    "version": "oracle-1",
    "checkedOn": "2026-10-02",
    "price": "0.5 IMD",
    "title": "oracle.request：带类型的问题与签名答案",
    "lead": "一个问题、一个由席位组成的评审组，以及合约可验证的 EIP-712 证明。",
    "docs": [
      {
        "label": "预言机请求体",
        "href": "https://imd.fun/docs#oracle-body"
      },
      {
        "label": "预言机读取与证明",
        "href": "https://imd.fun/docs#oracle"
      }
    ],
    "checkBody": {
      "question": "How many Transfer(address,address,uint256) logs did the contract 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 emit on Ethereum mainnet in the pinned block window, every from and to address included?",
      "panelSize": 5,
      "answerType": "uint256",
      "evidence": "chain",
      "chainId": 1,
      "toleranceBps": 0
    },
    "body": {
      "v": 1,
      "question": "How many Transfer(address,address,uint256) logs did the contract 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 emit on Ethereum mainnet in the pinned block window, every from and to address included?",
      "chainId": 1,
      "window": {
        "hours": 24
      },
      "answerType": "uint256",
      "evidence": "chain",
      "panelSize": 5,
      "quorum": 4,
      "validForSeconds": 86400
    },
    "checkResult": "无阻止项。一条 `wording` 建议：表述可能有多种理解，应明确时段、单位或术语。检查以置信度 1 推断 `answerType` 为 `uint256`、`evidence` 为 `chain`、`chainId` 为 1，并返回此处展示的报价请求体，补全 `quorum` 为 4、`validForSeconds` 为 86400。同一问题更宽泛的表述（“IMD 代币在窗口内发出了多少次转账事件？”）以 `ambiguous_question` 被拒绝。",
    "sections": [
      {
        "id": "two-bodies",
        "title": "两份请求体：检查与报价",
        "blocks": [
          {
            "kind": "p",
            "text": "检查接收简写形式（上方第一段）：`question`、`panelSize` 和可选字段。响应中的 `request` 是可用于报价的完整请求体；`proposed` 列出推断字段及各自置信度。将完整请求体（第二段）发送至 `POST /requests/quote`。若必须固定答案含义，请在报价前补充 `definitions`、`guards` 和 `toleranceBps`；检查不需要它们。"
          }
        ]
      },
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "问题明确事件签名、合约、链和窗口，并说明包含范围。措辞检查会拒绝存在多种合理解释的问题；`allowAmbiguous: true` 可跳过此检查，但应先在 `definitions` 中固定含义。",
              "默认使用 `evidence: \"chain\"`：每位成员以计算方案作答，部署者在签名前于固定区块上重新运行达成一致的方案。日志计数使用 `log-count` 方案，产出 `uint256`。",
              "api.imd.fun 上 `panelSize` 的下限为 5；`quorum` 指答案一致的数量，而非简单多数。",
              "报价时将窗口固定为精确区块。`{hours: 24}` 表示报价前的一天。"
            ]
          }
        ]
      },
      {
        "id": "answer",
        "title": "读取答案",
        "blocks": [
          {
            "kind": "code",
            "lang": "bash",
            "code": "curl --fail-with-body \"$IMD_API/oracle/requests/$REQUEST_ID\" | jq '{status, computed, agreement}'\n# once attested: the typed data and signature for your consumer contract\ncurl --fail-with-body \"$IMD_API/oracle/requests/$REQUEST_ID/attestation\""
          },
          {
            "kind": "p",
            "text": "付款购买的是问题及其评审组，并不保证答案：评审组若无法达成一致，就会在无答案的情况下结束。自 2026-09-30 起，证明域版本为 2；使用版本 1 库构建的消费合约需要更新库并重新部署。"
          }
        ]
      }
    ]
  },
  {
    "slug": "schedule-create",
    "action": "schedule.create",
    "version": "schedule-1",
    "checkedOn": "2026-10-02",
    "price": "每次运行 0.5 IMD",
    "title": "schedule.create：每天提出同一个问题",
    "lead": "持续执行的订单：按固定节奏运行一个预言机问题或一个任务，运行次数由一次付款购买的次数决定。",
    "docs": [
      {
        "label": "定时计划请求体",
        "href": "https://imd.fun/docs#schedule-body"
      },
      {
        "label": "定时计划",
        "href": "https://imd.fun/docs#schedules"
      }
    ],
    "body": {
      "label": "daily IMD transfer count",
      "action": "oracle.request",
      "cadence": {
        "cron": "0 9 * * *",
        "tz": "UTC"
      },
      "runs": 3,
      "input": {
        "v": 1,
        "question": "How many Transfer(address,address,uint256) logs did the contract 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 emit on Ethereum mainnet in the pinned block window, every from and to address included?",
        "chainId": 1,
        "window": {
          "hours": 24
        },
        "answerType": "uint256",
        "evidence": "chain",
        "panelSize": 5,
        "quorum": 4,
        "toleranceBps": 0,
        "validForSeconds": 86400,
        "guards": {
          "min": "0",
          "max": "100000000"
        }
      }
    },
    "checkResult": "无阻止项，无建议。同日，一个任务变体也通过了检查：操作为 `job.open`，节奏为 `{every: \"P1W\"}`，`runs` 为 2，`continue` 为 `true`，输入为 `research-report` 任务。节奏 `{every: \"PT5M\"}` 以 `invalid_cadence` 被拒绝（问题之间至少间隔 10 分钟）。",
    "sections": [
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "内部 `input` 是完整预言机请求体，不是检查的简写形式，并须通过与单次付费 `oracle.request` 相同的检查。相对窗口会解析为每次运行前的区块，因此 `{hours: 24}` 始终表示此前一天。",
              "`runs: 3` 以一次付款购买三次运行，每次 0.5 IMD。仅成功创建问题或任务的运行消耗一次额度；跳过和失败的运行不收费。未使用次数不退款。",
              "此定时表达式每天触发一次，高于问题的十分钟最小间隔（任务为三十分钟）。",
              "该问题与单次 `oracle.request` 中通过检查的问题相同。较宽泛的措辞在定时计划中也以 `ambiguous_question` 被拒绝。"
            ]
          }
        ]
      },
      {
        "id": "owner",
        "title": "所有者与控制权限",
        "blocks": [
          {
            "kind": "p",
            "text": "付款钱包拥有定时计划，可通过 `GET /schedules?owner=0x…` 列出。所有权不附带控制权限：暂停和取消仍由 IMD 团队掌握。连续三次运行失败后，定时计划暂停，直到充值；已付费的定时计划不会过期。"
          }
        ]
      }
    ]
  },
  {
    "slug": "schedule-topup",
    "action": "schedule.topup",
    "version": "topup-1",
    "checkedOn": "2026-10-02",
    "price": "每次运行 0.5 IMD",
    "title": "schedule.topup：为任意定时计划增加次数",
    "lead": "按当前单次价格，为自己或他人的定时计划增加运行次数。",
    "docs": [
      {
        "label": "充值",
        "href": "https://imd.fun/docs#schedule-body"
      },
      {
        "label": "定时计划",
        "href": "https://imd.fun/docs#schedules"
      }
    ],
    "body": {
      "scheduleId": "SCHEDULE_ID",
      "runs": 1
    },
    "checkResult": "无阻止项，无建议。检查时以活跃的 `job.open` 定时计划（`9d4b4168-b031-4cc6-880b-3f9cc40c9063`）替换 `SCHEDULE_ID`。不存在的计划编号以 `unknown_schedule` 被拒绝。",
    "sections": [
      {
        "id": "why",
        "title": "此请求体通过检查的原因",
        "blocks": [
          {
            "kind": "ul",
            "items": [
              "两个字段均必填。`runs` 为 1 至 1,000,000；报价按每次运行的价格乘以次数计费。",
              "任何钱包均可为任意定时计划充值。次数耗尽或连续三次运行失败后自动暂停的计划，将从下一个时段恢复。",
              "已取消或已过期的计划会在报价时返回 422。若计划在报价后、付款确认前被取消，则返回 `{kind:\"refused\"}`，运行次数不退款。"
            ]
          }
        ]
      },
      {
        "id": "find",
        "title": "查找定时计划",
        "blocks": [
          {
            "kind": "code",
            "lang": "bash",
            "code": "curl --fail-with-body \"$IMD_API/schedules?owner=$YOUR_WALLET\" | jq '.schedules[] | {id, label, status, runs}'\ncurl --fail-with-body \"$IMD_API/schedules/$SCHEDULE_ID\" | jq '{status, statusReason, runsRemaining, nextRunAt}'"
          }
        ]
      }
    ]
  }
];
