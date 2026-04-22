#!/usr/bin/env bun
/**
 * Spawns a nested `bun` with every known `bun:bundle` feature flag enabled
 * (matches README feature list). Does NOT set USER_TYPE=ant by default: this
 * fork is missing internal-only modules (e.g. REPLTool), and ant mode would
 * crash on require(). Set USER_TYPE=ant yourself only if your tree includes
 * those files. ENABLE_LSP_TOOL defaults to true when unset.
 *
 * This fork is missing several tool/skill entry modules that upstream gates
 * behind feature flags. Those flags are omitted below so `bun run start`
 * does not fail on require() (see FORK_EXCLUDED_FEATURES).
 *
 * Usage: bun scripts/dev-with-all-features.ts [--watch] <entrypoint> [args...]
 *        (see package.json "start" / "dev" / "mcp" / "start:home")
 */

import { spawnSync } from 'node:child_process'

/** Keep in sync with README.md "完整 Feature Flag 列表". */
const BUNDLE_FEATURES = [
  'ABLATION_BASELINE',
  'AGENT_MEMORY_SNAPSHOT',
  'AGENT_TRIGGERS',
  'AGENT_TRIGGERS_REMOTE',
  'ALLOW_TEST_VERSIONS',
  'ANTI_DISTILLATION_CC',
  'AUTO_THEME',
  'AWAY_SUMMARY',
  'BASH_CLASSIFIER',
  'BG_SESSIONS',
  'BREAK_CACHE_COMMAND',
  'BRIDGE_MODE',
  'BUDDY',
  'BUILDING_CLAUDE_APPS',
  'BUILTIN_EXPLORE_PLAN_AGENTS',
  'BYOC_ENVIRONMENT_RUNNER',
  'CACHED_MICROCOMPACT',
  'CCR_AUTO_CONNECT',
  'CCR_MIRROR',
  'CCR_REMOTE_SETUP',
  'CHICAGO_MCP',
  'COMMIT_ATTRIBUTION',
  'COMPACTION_REMINDERS',
  'CONNECTOR_TEXT',
  'CONTEXT_COLLAPSE',
  'COORDINATOR_MODE',
  'COWORKER_TYPE_TELEMETRY',
  'DAEMON',
  'DIRECT_CONNECT',
  'DOWNLOAD_USER_SETTINGS',
  'DUMP_SYSTEM_PROMPT',
  'ENHANCED_TELEMETRY_BETA',
  'EXPERIMENTAL_SKILL_SEARCH',
  'EXTRACT_MEMORIES',
  'FILE_PERSISTENCE',
  'FORK_SUBAGENT',
  'HARD_FAIL',
  'HISTORY_PICKER',
  'HISTORY_SNIP',
  'HOOK_PROMPTS',
  'IS_LIBC_GLIBC',
  'IS_LIBC_MUSL',
  'KAIROS',
  'KAIROS_BRIEF',
  'KAIROS_CHANNELS',
  'KAIROS_DREAM',
  'KAIROS_GITHUB_WEBHOOKS',
  'KAIROS_PUSH_NOTIFICATION',
  'LODESTONE',
  'MCP_RICH_OUTPUT',
  'MCP_SKILLS',
  'MEMORY_SHAPE_TELEMETRY',
  'MESSAGE_ACTIONS',
  'MONITOR_TOOL',
  'NATIVE_CLIENT_ATTESTATION',
  'NATIVE_CLIPBOARD_IMAGE',
  'NEW_INIT',
  'OVERFLOW_TEST_TOOL',
  'PERFETTO_TRACING',
  'POWERSHELL_AUTO_MODE',
  'PROACTIVE',
  'PROMPT_CACHE_BREAK_DETECTION',
  'QUICK_SEARCH',
  'REACTIVE_COMPACT',
  'REVIEW_ARTIFACT',
  'RUN_SKILL_GENERATOR',
  'SELF_HOSTED_RUNNER',
  'SHOT_STATS',
  'SKILL_IMPROVEMENT',
  'SLOW_OPERATION_LOGGING',
  'SSH_REMOTE',
  'STREAMLINED_OUTPUT',
  'TEAMMEM',
  'TEMPLATES',
  'TERMINAL_PANEL',
  'TOKEN_BUDGET',
  'TORCH',
  'TRANSCRIPT_CLASSIFIER',
  'TREE_SITTER_BASH',
  'TREE_SITTER_BASH_SHADOW',
  'UDS_INBOX',
  'ULTRAPLAN',
  'ULTRATHINK',
  'UNATTENDED_RETRY',
  'UPLOAD_USER_SETTINGS',
  'VERIFICATION_AGENT',
  'VOICE_MODE',
  'WEB_BROWSER_TOOL',
  'WORKFLOW_SCRIPTS',
] as const

/**
 * Feature names skipped in this repo: enabling them pulls in modules that are
 * absent or stub-only in this snapshot (e.g. SleepTool, hunter skill).
 */
const FORK_EXCLUDED_FEATURES = new Set<string>([
  'CONTEXT_COLLAPSE',
  'DAEMON',
  'HISTORY_SNIP',
  'KAIROS',
  'KAIROS_BRIEF',
  'KAIROS_CHANNELS',
  'KAIROS_DREAM',
  'KAIROS_GITHUB_WEBHOOKS',
  'KAIROS_PUSH_NOTIFICATION',
  'PROACTIVE',
  'REVIEW_ARTIFACT',
  'RUN_SKILL_GENERATOR',
  'TERMINAL_PANEL',
  'TORCH',
  'UDS_INBOX',
  'WEB_BROWSER_TOOL',
  'WORKFLOW_SCRIPTS',
])

const ENABLED_BUNDLE_FEATURES = BUNDLE_FEATURES.filter(
  name => !FORK_EXCLUDED_FEATURES.has(name),
)

const passthrough = process.argv.slice(2)
if (passthrough.length === 0) {
  console.error(
    'usage: bun scripts/dev-with-all-features.ts [--watch] <entrypoint> [args...]',
  )
  process.exit(1)
}

const featureArgs = ENABLED_BUNDLE_FEATURES.flatMap(name => [
  '--feature',
  name,
])
const cmd = ['bun', ...featureArgs, ...passthrough]

const env: NodeJS.ProcessEnv = { ...process.env }
if (env.ENABLE_LSP_TOOL === undefined) {
  env.ENABLE_LSP_TOOL = 'true'
}

const result = spawnSync(cmd[0], cmd.slice(1), {
  stdio: 'inherit',
  env,
  encoding: 'utf8',
})

process.exit(result.status === null ? 1 : result.status)
