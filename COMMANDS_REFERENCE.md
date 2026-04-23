# Claude Code 内置命令参考

> 版本: 2.1.88-source.0 | 更新日期: 2026-04-23

---

## 目录

- [常用命令](#常用命令)
- [代码与开发](#代码与开发)
- [会话管理](#会话管理)
- [配置与设置](#配置与设置)
- [插件与扩展](#插件与扩展)
- [模型与性能](#模型与性能)
- [隐藏/条件启用命令](#隐藏条件启用命令)
- [彩蛋功能](#彩蛋功能)
- [已迁移到插件的命令](#已迁移到插件的命令)
- [不可用命令 (Source Build Stub)](#不可用命令-source-build-stub)

---

## 常用命令

| 命令 | 说明 | 参数 |
|------|------|------|
| `/help` | 显示帮助和可用命令 | 无 |
| `/status` | 显示 Claude Code 状态（版本、模型、账户、API 连接、工具状态） | 无 |
| `/model [model]` | 设置 AI 模型 | `[模型名]` |
| `/clear` | 清除对话历史并释放上下文 | 无（别名: `reset`, `new`） |
| `/exit` | 退出 REPL | 无（别名: `quit`） |
| `/copy [N]` | 复制 Claude 上次回复到剪贴板（或第 N 条） | 无 或 `N` |
| `/export [filename]` | 导出当前对话到文件或剪贴板 | `[文件名]` |
| `/rename [name]` | 重命名当前对话 | `[名称]` |
| `/resume [id\|term]` | 恢复之前的对话 | `[对话 ID 或搜索词]`（别名: `continue`） |
| `/color <color\|default>` | 设置提示栏颜色 | `<颜色名\|default>` |
| `/theme` | 切换主题 | 无 |
| `/vim` | 切换 Vim / Normal 编辑模式 | 无 |
| `/stats` | 显示使用统计 | 无 |
| `/cost` | 显示当前会话费用和耗时 | 无 |
| `/usage` | 显示套餐使用限额 | 无 |
| `/version` | 显示当前运行版本 | 仅 Ant 用户可见 |
| `/mobile` | 显示 Claude 移动 App 下载二维码 | 无（别名: `ios`, `android`） |
| `/desktop` | 在 Claude Desktop 中继续当前会话 | 无（别名: `app`，仅 macOS/Windows） |

---

## 代码与开发

| 命令 | 说明 | 参数 |
|------|------|------|
| `/commit` | 创建 git commit（自动 stage 和生成 commit message） | 可选额外指令 |
| `/commit-push-pr` | Commit、推送并创建 PR | 可选额外指令 |
| `/review` | 审查 Pull Request | PR 编号 |
| `/diff` | 查看未提交的更改和逐轮 diff | 无 |
| `/rewind` | 恢复代码和/或对话到之前的时间点 | 无（别名: `checkpoint`） |
| `/plan [open\|desc]` | 进入计划模式或查看当前计划 | `[open\|描述]` |
| `/branch [name]` | 从当前对话点创建分支 | `[分支名]` |
| `/btw <question>` | 快速提问，不打断主对话 | `<问题>` |
| `/tasks` | 列出和管理后台任务 | 无（别名: `bashes`） |
| `/files` | 列出当前上下文中所有文件 | 仅 Ant 用户可见 |

---

## 会话管理

| 命令 | 说明 | 参数 |
|------|------|------|
| `/compact [instructions]` | 清除对话历史但保留摘要 | `[自定义摘要指令]` |
| `/context` | 可视化当前上下文使用情况（彩色网格） | 无 |
| `/memory` | 编辑 Claude 记忆文件 | 无 |
| `/tag <tag-name>` | 在当前会话上打标签 | `<标签名>`（仅 Ant 用户） |
| `/add-dir <path>` | 添加新的工作目录 | `<路径>` |

---

## 配置与设置

| 命令 | 说明 | 参数 |
|------|------|------|
| `/config` | 打开配置面板 | 无（别名: `settings`） |
| `/hooks` | 查看工具事件的 hook 配置 | 无 |
| `/ide [open]` | 管理 IDE 集成和显示状态 | `[open]` |
| `/terminal-setup` | 安装 Shift+Enter 键绑定 | 无 |
| `/keybindings` | 打开或创建快捷键配置文件 | 无（需启用 keybinding 自定义） |
| `/privacy-settings` | 查看和更新隐私设置 | 仅消费者订阅用户 |
| `/login` | 登录 Anthropic 账户 / 切换账户 | 无 |
| `/logout` | 登出 Anthropic 账户 | 无 |
| `/mcp [enable\|disable [server]]` | 管理 MCP 服务器 | `[enable\|disable [服务器名]]` |
| `/chrome` | Claude in Chrome (Beta) 设置 | 无 |
| `/remote-setup` | 在 Web 上设置 Claude Code（需连接 GitHub） | 仅策略允许远程会话时可见 |
| `/remote-env` | 配置远程环境默认值 | 仅 claude-ai 订阅 + 策略允许时 |
| `/session` | 显示远程会话 URL 和二维码 | 仅远程模式激活时（别名: `remote`） |
| `/sandbox` | 切换沙箱模式 / 显示沙箱状态 | 可选排除命令模式 |
| `/doctor` | 诊断和验证 Claude Code 安装和设置 | 无 |
| `/statusline` | 设置状态栏 UI | 可选 prompt |

---

## 插件与扩展

| 命令 | 说明 | 参数 |
|------|------|------|
| `/plugin` | 管理 Claude Code 插件 | 无（子命令: `install/uninstall/manage/enable/disable/validate/marketplace`） |
| `/plugins` | 同上 | 别名 |
| `/marketplace` | 同上 | 别名 |
| `/skills` | 列出可用 skills | 无 |
| `/agents` | 管理 Agent 配置 | 无 |
| `/reload-plugins` | 在当前会话中激活待处理的插件变更 | 无 |
| `/install-github-app` | 为仓库设置 Claude GitHub Actions | 无 |
| `/install-slack-app` | 安装 Claude Slack App | 需 claude-ai 访问权限 |

---

## 模型与性能

| 命令 | 说明 | 参数 |
|------|------|------|
| `/effort [level]` | 设置模型思考深度 | `[low\|medium\|high\|max\|auto]` |
| `/fast [on\|off]` | 切换快速模式（更便宜/更快的模型） | `[on\|off]` |
| `/advisor [model\|off]` | 配置顾问模型（用于建议/分析的独立模型） | `[模型\|off]` |
| `/extra-usage` | 配置超额使用以在达到限额后继续工作 | 需允许超额配置 |
| `/rate-limit-options` | 达到速率限制时显示选项 | 仅 claude-ai 订阅用户（帮助中隐藏） |
| `/upgrade` | 升级到 Max 获得更高限额和更多 Opus | 企业用户隐藏 |

---

## 隐藏/条件启用命令

这些命令默认隐藏，需满足特定条件或通过环境变量开启：

| 命令 | 启用条件 | 说明 |
|------|---------|------|
| `/brief` | Kairos/Brief 功能标志 + 配置启用 | 切换 brief-only 模式（Claude 仅通过 Brief 工具发送状态更新） |
| `/voice` | 语音功能标志 + voice mode 启用 + claude-ai | 切换语音模式 |
| `/think-back` | GrowthBook 标志 `tengu_thinkback` | 2025 年度回顾动画 |
| `/ultrareview` | Ultrareview 功能启用（团队/企业/消费者订阅） | ~10-20 分钟深度代码审查，在 Web 端运行 |
| `/bridge` | `BRIDGE_MODE` 构建标志 + bridge 启用 | 远程控制模式（别名: `rc`） |
| `/passes` | 推荐计划资格 | 推荐计划相关 |

---

## 彩蛋功能

### Buddy 宠物系统

Claude Code 内置了一个 ASCII 宠物伙伴系统。每个用户会获得一个随机生成的宠物，它会坐在输入框旁边，偶尔在气泡中发表评论。

#### 宠物属性

- **18 个物种**: duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk
- **5 个稀有度**: common (60%), uncommon (25%), rare (10%), epic (4%), legendary (1%)
- **6 种眼睛**: `·`, `✦`, `×`, `◉`, `@`, `°`
- **8 种帽子**: none, crown, tophat, propeller, halo, wizard, beanie, tinyduck
- **5 项属性**: DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK
- **Shiny 变种**: 概率出现

#### 如何使用

Buddy 系统通过 `feature('BUDDY')` **构建时标志**控制。在当前 source build 中：

- `/buddy` 命令目前是 **stub**（`isEnabled: () => false`）
- `BUDDY` 构建标志在当前构建中**未启用**

这意味着在当前版本中**无法直接使用**该功能。该功能计划在 2026 年 4 月 1-7 日期间进行预告通知，之后正式推出。

#### 宠物 ASCII 示例

```
Penguin:              Cat:                Dragon:
  .---.               /\_/\               /^\  /^\
 (·>·)               ( ·  ·)             <  ·  ·  >
/(   )\              (  ω  )             (   ~~   )
 `---´               (")_(")              `-vvvv-´
```

#### 互动方式（功能上线后）

- `/buddy` — 查看你的宠物
- `/buddy pet` — 抚摸宠物（会触发爱心飘动动画）
- 宠物会在输入框旁显示，偶尔在气泡中发表评论

### 其他彩蛋

| 命令 | 说明 | 状态 |
|------|------|------|
| `/good-claude` | 内部彩蛋（表扬 Claude） | Source build 中不可用 |
| `/stickers` | 订购 Claude Code 实体贴纸 | 可用 |

---

## 已迁移到插件的命令

这些命令已从核心代码迁移到插件市场，需通过 `/plugin install` 安装：

| 原命令 | 说明 | 迁移位置 |
|--------|------|---------|
| `/autofix-pr` | 自动修复 PR | 插件市场 |
| `/bughunter` | Bug 狩猎/审查工具 | 插件市场 |
| `/pr-comments` | PR 评论 | 插件市场 |
| `/security-review` | 安全审查 | 插件市场 |

---

## 不可用命令 (Source Build Stub)

以下命令在源码构建中为占位符，显示 "Not available in source build"：

| 命令 | 说明 |
|------|------|
| `/ant-trace` | 内部追踪工具 |
| `/backfill-sessions` | 回填会话 |
| `/break-cache` | 清除缓存 |
| `/ctx_viz` | 上下文可视化 |
| `/debug-tool-call` | 调试工具调用 |
| `/env` | 环境变量查看 |
| `/fork` | 分支会话 |
| `/heapdump` | JS 堆转储到 ~/Desktop |
| `/issue` | 提交 Issue |
| `/mock-limits` | Mock 限额 |
| `/oauth-refresh` | OAuth 刷新 |
| `/onboarding` | 引导体验 |
| `/output-style` | 输出风格（已弃用，用 `/config` 替代） |
| `/peers` | 同行会话 |
| `/perf-issue` | 性能 Issue |
| `/reset-limits` | 重置限额 |
| `/share` | 分享会话 |
| `/summary` | 对话摘要 |
| `/teleport` | 远程传送 |
| `/workflows` | 工作流管理 |

---

## 环境变量速查

可用于开启实验性功能或调试的环境变量：

| 变量 | 说明 |
|------|------|
| `CLAUDE_CODE_FORCE_CHICAGO_MCP=1` | 强制启用 Computer Use（桌面 GUI 自动化） |
| `CLAUDE_CODE_BRIEF=1` | 启用 Brief 模式（开发/测试用） |
| `CLAUDE_CODE_COORDINATOR_MODE=1` | 启用多代理协调模式 |
| `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT=1` | 始终显示 effort 控制 |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` | 禁用所有自动记忆功能 |
| `CLAUDE_CODE_SIMPLE=1` | 极简模式（移除记忆、禁用 autoDream） |
| `CLAUDE_CODE_DISABLE_FAST_MODE=1` | 禁用快速模式 |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` | 禁用后台任务 |
| `CLAUDE_CODE_DEBUG_REPAINTS=1` | 调试重绘可视化 |
| `CLAUDE_CODE_PROFILE_QUERY=1` | 启用查询性能分析 |
| `CLAUDE_CODE_TERMINAL_RECORDING=1` | 启用终端录制 (asciicast) |
| `CLAUDE_CODE_ENABLE_TELEMETRY=1` | 启用遥测收集 |
| `CLAUDE_CODE_BUBBLEWRAP=1` | 禁用 bubblewrap 沙箱 |
| `CLAUDE_CODE_SKIP_PROMPT_HISTORY=1` | 跳过写入历史记录 |
| `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING=1` | 禁用文件检查点 |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1` | 禁用 CLAUDE.md 加载 |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1` | 禁用终端标题更新 |
| `CLAUDE_CODE_DISABLE_CRON=1` | 禁用 cron 调度 |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` | 禁用实验性 beta 功能 |

---

## GrowthBook 实验功能标志

可通过修改 `~/.claude-dev/.claude.json` 中的 `cachedGrowthBookFeatures` 来临时开启（会在下次网络同步时被覆盖）：

| 标志 | 功能 | 默认值 |
|------|------|--------|
| `tengu_session_memory` | 会话记忆自动提取 | false |
| `tengu_onyx_plover` | Auto Dream 跨会话记忆整合 | false |
| `tengu_scratch` | 多代理共享暂存区 | false |
| `tengu_slate_heron` | 智能微压缩 | false |
| `tengu_thinkback` | 年度回顾 | false |
| `tengu_malort_pedway` | Computer Use 增强 | false |
| `tengu_snippet_save` | 代码片段保存 | false |
| `tengu_streaming_text` | 流式文本显示 | false |
| `tengu_tool_result_persistence` | 工具结果持久化 | false |
| `tengu_birthday_hat` | 生日帽彩蛋 | false |
