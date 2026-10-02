import type { ErrorEntry } from './types.ts';

export const errors: ErrorEntry[] = [
  {
    "code": "invalid_input",
    "where": "quote",
    "status": "报价时为 422；检查时为阻止项",
    "cause": "请求体违反字段规则：类型或长度错误，同时指定 `skill`、`steps`、`template` 中两项，包含操作不接受的字段（例如 `job.open` 中的 `onchain`、`job.continue` 以外的 `parentJobId`、缺少 `baseCommit` 的 `repoUrl`），或使用尚未开放发布的链。",
    "fix": "阅读 `detail` 和 `problems`，其中会指明字段。发布改用 `launch.open`，续接改用 `job.continue`，并仅保留 `skill`、`steps`、`template` 中一项。未发生扣款。",
    "observed": "2026-10-02：带有 `onchain: \"evm_project\"` 的 `job.open` 返回阻止项：“任务价格不涵盖发布；请改用 `launch.open`”。",
    "docs": "paid",
    "required": true
  },
  {
    "code": "invalid_payment_shape",
    "where": "submit",
    "status": "400",
    "cause": "`PAYMENT-SIGNATURE` 头中的付款载荷在某一层级包含控制平面未列出的键。常见原因是开发工具包附带了非空 `extensions`；`accepted` 不等于支付挑战的 `accepts[0]` 或 `resource.url` 错误也会导致同样失败。",
    "fix": "仅根据支付挑战构建载荷：`x402Version`、可选 `resource`、从 `accepts[0]` 复制的 `accepted`、`payload.signature`、`payload.permit2Authorization`。移除 `extensions` 或将其置空。`detail` 会指明违规字段。",
    "observed": "未复现：需要签名付款。依据文档及其公布的载荷结构记录。",
    "docs": "paid",
    "required": true
  },
  {
    "code": "missing_fact token_supply",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "请求需要铸造代币，却未说明总供应量，而评估器需要该信息来规划铸造。对于构建者可自行决定的事实（如 `numbers` 或 `access`），`missing_fact` 也可能仅作为建议出现；只有 `required` 为真时才会阻止执行。",
    "fix": "在请求文本中说明供应量。项目或钩子发布仅支持一次铸造 1,000,000,000 枚、18 位小数；明确这一点，或切换至 `custom_token` 配合 `economics` 自定义。同一句中也应说明代币名称和符号，它们同样是必填事实。",
    "observed": "2026-10-02：带有 `onchain` 但未提供代币事实的 `job.open` 对 `token_name`、`token_symbol` 和 `token_supply` 返回了阻止性的 `missing_fact`。声明固定供应量的工作流将 `token_supply` 标记为 `fixed` 并通过检查。",
    "docs": "workflow-body",
    "required": true
  },
  {
    "code": "unplannable_steps",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "步骤的技能已经自行声明写入范围，却仍指定了 `paths`。检查当日，`write-readme-and-docs`、`gas-and-size-report` 和 `deploy-script` 均属于此类。",
    "fix": "从这些步骤中移除 `paths`。对需要路径的技能（如 `write-foundry-tests`、`implement-component` 和 `refine-project`）保留 `paths`。文档表格将上述三项技能的 `paths` 列为必填，但实时检查与之矛盾；以实时检查为准。",
    "observed": "2026-10-02：包含 `write-readme-and-docs` 且路径为 `[\"README.md\", \"docs\"]` 的步骤链返回：“步骤 2（`write-readme-and-docs`）自行声明写入范围，因此不得另行指定路径”。",
    "docs": "job-body",
    "required": true
  },
  {
    "code": "protected_path",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "步骤的 `paths` 包含任何任务都不得修改的路径。`foundry.toml`、`lib` 和 `lib/**` 受保护：不得修改工作节点的工具链和随仓库提供的依赖库。",
    "fix": "从 `paths` 中移除这些路径。依赖由工作节点提供并提交；编译器设置遵循网络固定的工具链。请在目标中描述所需行为。",
    "observed": "2026-10-02：`write-foundry-tests` 配合路径 `[\"test\", \"foundry.toml\", \"lib\"]` 返回三个 `protected_path` 阻止项，分别对应 `foundry.toml`、`lib` 和 `lib/**`，并指明节点 `write_foundry_tests`。",
    "docs": "job-body",
    "required": true
  },
  {
    "code": "recheck_failed",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "工作流评估器重新构建的计划未能通过自身复查。常见原因是规则模糊，检查器无法判断需求，例如是否需要面向用户的网站。要求只读角色（`adversarial-review`、审计节点）产出失败测试等内容也会触发此问题。",
    "fix": "明确说明合约行为、谁能调用什么，以及是否需要网站、网站展示什么。让评审专注评审：测试应交给实施步骤；评审者报告发现，不编辑源码或测试。",
    "observed": "2026-10-02：请求“制作一个优秀且公平的代币”并要求对抗性评审“编写失败测试”的工作流返回 `recheck_failed`：“检查器无法确定请求是否需要计划中包含的面向用户的网站或应用界面，请明确说明”。",
    "docs": "workflow-body",
    "required": true
  },
  {
    "code": "needs_revision",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "评估器认为请求必须修改后才能规划：规则过于模糊，或要求某角色执行无法完成的指令。它与 `recheck_failed` 伴随出现，原因相同。",
    "fix": "用具体规则和数值重写请求，然后重新检查。`facts` 中状态为 `missing` 且 `required: true` 的每一行，都对应一条必须补充的说明。",
    "observed": "2026-10-02：所有探测均未返回此代码；相同的模糊输入返回了 `recheck_failed`。本条依据原任务说明收录。",
    "docs": "workflow-body",
    "required": true
  },
  {
    "code": "invalid_plan",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "无法重新构建原始计划。常见原因是文本过长：`request`、`context` 和 `draft.objective` 合并后超过约 7,000 字符。各字段单独可允许最多 16,000 字符，因此真正触发的是合并限制。",
    "fix": "将请求缩减为构建者必须知道的内容，将决策移入简短的 `context` 行。草案目标保留一两句。同日，7,900 字符的目标作为普通 `job.open` 通过了检查；合并限制针对工作流。",
    "observed": "2026-10-02：请求为 5,200 字符、上下文为 2,600 字符的工作流返回 `invalid_plan`（“重新构建前请修正无效的原始计划”），以及关于源码发布的 `unresolved_decision`。",
    "docs": "workflow-body",
    "required": true
  },
  {
    "code": "objective_too_large",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "评估器为首个任务生成的合并目标超限。根源与 `invalid_plan` 相同：请求、上下文和草案目标的总文本过长。",
    "fix": "按 `invalid_plan` 的方法缩短文本。长篇规范放入任务起始仓库（`repoUrl` + `baseCommit`）或命名输入文件，而不是请求中。",
    "observed": "2026-10-02：所有探测均未返回此代码；超长工作流返回了 `invalid_plan`。本条依据原任务说明收录。",
    "docs": "workflow-body",
    "required": true
  },
  {
    "code": "payer_not_owner",
    "where": "submit",
    "status": "403",
    "cause": "`job.continue` 的付款钱包并非此前为项目付款的钱包（父任务的 `paidBy`）。任何资产转移发生前即被拒绝。",
    "fix": "使用项目所属钱包付款。若要基于非自己付款的项目构建，请创建新任务，将原仓库作为 `repoUrl` 和 `baseCommit`，已接受文件作为 `inputs`。",
    "observed": "未复现：需要付款。免费检查无法知道哪个钱包将付款。",
    "docs": "continue",
    "required": true
  },
  {
    "code": "request_key_conflict",
    "where": "quote",
    "status": "409",
    "cause": "此 `requestKey` 曾用于不同的 `action` 或 `input`。一个键只标识一份确切报价。",
    "fix": "新请求体使用新的 UUID。仅在重试完全相同的报价时复用键；这会返回 200 和同一订单。",
    "observed": "未复现：报价会创建订单且需要请求令牌。依据文档记录。",
    "docs": "paid",
    "required": true
  },
  {
    "code": "launch_token",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "请求要求项目或钩子发布部署不符合规则的代币：不同供应量、小数位数、手续费、限制、暂停或增发功能。",
    "fix": "移除这些代币条款：项目或钩子发布均部署 1,000,000,000 枚、18 位小数、普通转账的代币，10% 归智能体群。通过 `economics.poolBps` 和 `remainderTo` 指定你的 90% 如何分配。自定义条款请使用 `onchain: \"custom_token\"` 和完整的 `economics`。",
    "observed": "2026-10-02：要求 21,000,000 枚、8 位小数的 `univ4_hook` 发布，以及要求 1,000,000 枚的工作流，均返回 `launch_token` 和完整的固定代币说明。",
    "docs": "job-body",
    "required": true
  },
  {
    "code": "too_many_publishes",
    "where": "run",
    "status": "POST /sites/publish 返回 429",
    "cause": "某席位在一天内通过设备接口发布了十个以上的网站。付费任务托管网站经由发布服务，不受此配额限制。",
    "fix": "等待 `Retry-After` 指定的时间。请求者应让任务通过 `ipfs: true` 或网站标签托管网站，而不是从席位直接发布。",
    "observed": "未复现：需要已配对的设备密钥。",
    "docs": "sites",
    "required": true
  },
  {
    "code": "no_panel",
    "where": "read",
    "status": "GET /jobs/:id/panel 返回 404",
    "cause": "此任务不是研究评审组。只有 `template: \"research\"` 任务具有评审组；`research-report` 技能任务产出结果，不创建评审组。",
    "fix": "报告任务读取 `GET /jobs/:id/result`；问题读取 `GET /oracle/requests/:id`。用 `GET /research/panels` 列出已结束的评审组。",
    "observed": "2026-10-02：GET /jobs/96e5354f-6e81-4063-9fe2-6d1c44c7b192/panel（一个 `create-image` 任务）返回 404 `{\"error\":\"no_panel\",\"detail\":\"that job has no panel\"}`。",
    "docs": "research",
    "required": true
  },
  {
    "code": "unknown_schedule",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422；GET /schedules/:id 返回 404",
    "cause": "没有使用该编号的定时计划。`schedule.topup` 指定了未创建过的编号，或编号有笔误。",
    "fix": "从 `GET /schedules?owner=0x…`，或创建该计划的 `schedule.create` 准入结果中复制编号。",
    "observed": "2026-10-02：使用全零 UUID 的 `schedule.topup` 返回阻止项“没有使用该编号的定时计划”；GET /schedules/<同一编号> 返回 404 `unknown_schedule`。",
    "docs": "schedules",
    "required": true
  },
  {
    "code": "invalid_owner",
    "where": "read",
    "status": "GET /schedules?owner= 返回 400",
    "cause": "`owner` 查询参数不是 0x 钱包地址。",
    "fix": "提供完整的 0x 地址，包含 40 个十六进制字符。所有者地址以小写存储；大小写均可匹配。",
    "observed": "2026-10-02：GET /schedules?owner=notawallet 返回 400 `{\"error\":\"invalid_owner\",\"detail\":\"owner must be a 0x wallet address\"}`。",
    "docs": "schedules",
    "required": true
  },
  {
    "code": "evaluation_unavailable",
    "where": "check",
    "status": "临时错误；评估器无法响应时由检查或报价返回",
    "cause": "负责读取请求的评判服务不可达或超时。不是请求体导致的问题，未发生扣款。",
    "fix": "稍等后使用相同的 `requestKey` 重试。若持续出现，读取 `GET /health` 查看服务提供方状态。",
    "observed": "检查当日未复现：每次探测均完成评判。本条依据原任务说明收录。",
    "docs": "errors",
    "required": true
  },
  {
    "code": "ambiguous_question",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "措辞检查认为预言机问题存在多种合理解释。",
    "fix": "在问题本身中明确时段、单位、舍入方式或术语含义；其他定义放入 `definitions`。`allowAmbiguous: true` 会跳过措辞检查，按原文提问。",
    "observed": "2026-10-02：“IMD 代币（0xd34a…）在以太坊主网窗口内发出了多少次转账事件？”被拒绝；明确事件签名、合约和“包含所有发送方和接收方地址”后通过。",
    "docs": "oracle-body",
    "required": false
  },
  {
    "code": "invalid_cadence",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "定时计划触发间隔低于下限：问题之间十分钟，任务之间三十分钟。",
    "fix": "问题使用 `PT10M` 或更长间隔，任务使用 `PT30M` 或更长间隔，也可使用不低于该间隔的定时表达式。",
    "observed": "2026-10-02：预言机定时计划中的 `{every: \"PT5M\"}` 返回“此操作的运行间隔至少为 10 分钟”。",
    "docs": "schedule-body",
    "required": false
  },
  {
    "code": "unresolved_decision",
    "where": "check",
    "status": "检查时为阻止项，报价时为 422",
    "cause": "工作流评估器发现请求留有未决事项，例如是否可以独立于网站发布源码。",
    "fix": "在 `context` 中明确答复（“批准发布到 GitHub”），并让 `permissions` 与草案标志保持一致。",
    "observed": "2026-10-02：超长工作流中与 `invalid_plan` 一同返回。",
    "docs": "workflow-body",
    "required": false
  },
  {
    "code": "quote_expired",
    "where": "submit",
    "status": "410",
    "cause": "报价已超过 600 秒。",
    "fix": "使用新的 `requestKey` 重新获取报价。",
    "observed": "依据文档记录。",
    "docs": "paid",
    "required": false
  },
  {
    "code": "invalid_quote_approval",
    "where": "submit",
    "status": "400",
    "cause": "EIP-712 `QuoteApproval` 不匹配：几乎总是因为用于计算 `paymentHash` 的付款内容与 `PAYMENT-SIGNATURE` 头中的内容相差了字节。",
    "fix": "移除 `extensions` 后，对将编码进请求头的那个确切对象生成规范 JSON（键排序、无空白），然后计算哈希。",
    "observed": "依据文档记录。",
    "docs": "quote-approval",
    "required": false
  },
  {
    "code": "payment_rejected",
    "where": "submit",
    "status": "402",
    "cause": "付款无法结算；`reason` 说明原因，例如 `insufficient_funds` 或缺少 Permit2 授权额度。",
    "fix": "为钱包充值，授权 Permit2 使用 IMD，然后再次提交相同字节。重试复用订单，绝不会重复扣款。",
    "observed": "依据文档记录。",
    "docs": "paid",
    "required": false
  },
  {
    "code": "origin_not_allowed",
    "where": "submit",
    "status": "403",
    "cause": "跨源浏览器页面调用了付费接口。",
    "fix": "改用服务器或命令行调用。部分公开读取接口支持跨源资源共享，付费接口不支持。",
    "observed": "依据文档记录。",
    "docs": "base",
    "required": false
  },
  {
    "code": "request_limit",
    "where": "quote",
    "status": "429",
    "cause": "单个 IP 或请求令牌每分钟超过 300 次请求或 30 次报价。检查或导入按报价计数。",
    "fix": "等待 `Retry-After` 指定的时间。将检查适当合并；每次编辑后检查可以，每次按键后检查则不合适。",
    "observed": "依据文档记录。",
    "docs": "paid",
    "required": false
  },
  {
    "code": "too_many_reads",
    "where": "read",
    "status": "429",
    "cause": "单个 IP 在 api.imd.fun 上每分钟超过 120 次公开读取。",
    "fix": "通过浏览器服务（`https://explorer.imd.fun/api/...`）获取更高额度，或降低频率。",
    "observed": "依据文档记录。",
    "docs": "errors",
    "required": false
  }
];
