import { feature } from 'bun:bundle'

import { companionUserId, getCompanion, roll } from '../../buddy/companion.js'
import type { Companion, StoredCompanion } from '../../buddy/types.js'
import { RARITY_STARS, STAT_NAMES } from '../../buddy/types.js'
import type { ToolUseContext } from '../../Tool.js'
import type {
  Command,
  LocalJSXCommandContext,
  LocalJSXCommandOnDone,
} from '../../types/command.js'
import { saveGlobalConfig } from '../../utils/config.js'

// ---------------------------------------------------------------------------
// /buddy —— 2026 愚人节数字宠物系统的命令入口
// ---------------------------------------------------------------------------
// 上游 Claude Code v2.1.89 之后 `/buddy` 是彩蛋命令：让用户 hatch 一只基于
// userId 确定性生成的小动物（sprite 挂在 REPL 右下角），并提供 pet / rename /
// mute 等子命令。这个源码还原 fork 里 UI（src/buddy/CompanionSprite.tsx、
// useBuddyNotification.tsx、prompt.ts、companion.ts、sprites.ts）都在，但命令
// 入口的 load 函数在 sourcemap 里没还原出来——原版代码长啥样已不可考。
//
// 这里基于 companion.ts 已经完整的 roll()/bones 体系，手搓一个能用的实现：
//   /buddy            —— 首次 hatch 并打印卡片；已有则直接显示卡片
//   /buddy pet        —— 设置 AppState.companionPetAt = Date.now()，触发 sprite
//                        的爱心飘动动画（CompanionSprite 自己读这个字段）
//   /buddy mute       —— 开启 config.companionMuted，sprite 立刻隐藏
//   /buddy unmute     —— 关闭 companionMuted
//   /buddy rename X   —— 只改 StoredCompanion.name，不动 bones（rarity 不可刷）
//   /buddy release    —— 清掉 config.companion，让下次 /buddy 重新 hatch
//
// 由于需要 setAppState（pet 动画），必须用 local-jsx 类型——local 类型的 call
// 签名拿不到 context.setAppState。不生成 JSX overlay，始终 return null、用
// onDone 推一条 system message 即可。
// ---------------------------------------------------------------------------

// Name pool: 用 inspirationSeed 取模选一个当作默认名，用户可以 /buddy rename 改。
// 池子保持紧凑——毕竟是彩蛋，不追求完全覆盖所有 species。
const NAME_POOL = [
  'Pip',
  'Mochi',
  'Ziggy',
  'Puck',
  'Bramble',
  'Juniper',
  'Clove',
  'Waffle',
  'Pebble',
  'Fern',
  'Tofu',
  'Biscuit',
  'Nimbus',
  'Quill',
  'Basil',
  'Olive',
  'Sprout',
  'Sable',
  'Hazel',
  'Cinder',
  'Jasper',
  'Nova',
  'Echo',
  'Bean',
] as const

const DEFAULT_PERSONALITY = 'A curious little friend.'
const MAX_NAME_LEN = 24

function pickName(seed: number): string {
  return NAME_POOL[seed % NAME_POOL.length]!
}

function renderCard(c: Companion): string {
  const stars = RARITY_STARS[c.rarity]
  const shinyTag = c.shiny ? ' ✦shiny' : ''
  const hatTag = c.hat === 'none' ? '' : `  hat:${c.hat}`
  const statsLine = STAT_NAMES.map(s => `${s} ${c.stats[s]}`).join('  ')
  return [
    `🐾  ${c.name} — ${c.rarity} ${c.species}${shinyTag}`,
    `    ${stars}   eye:${c.eye}${hatTag}`,
    `    ${statsLine}`,
    ``,
    `    ${c.personality}`,
  ].join('\n')
}

function hatch(): Companion {
  const uid = companionUserId()
  const { bones, inspirationSeed } = roll(uid)
  const stored: StoredCompanion = {
    name: pickName(inspirationSeed),
    personality: DEFAULT_PERSONALITY,
    hatchedAt: Date.now(),
  }
  // 清掉历史的 companionMuted 以防用户之前 release 过又重开（mute 是全局状态）
  saveGlobalConfig(cfg => {
    const { companionMuted: _m, ...rest } = cfg
    return { ...rest, companion: stored }
  })
  return { ...stored, ...bones }
}

const buddy = {
  type: 'local-jsx',
  name: 'buddy',
  description: 'Meet your coding companion',
  // bun:bundle 的 feature() 宏要求"直接"出现在 if/三元里；这里三元包一层等价于
  // () => feature('BUDDY')。BUDDY feature flag 由 dev-with-all-features.ts 启用。
  isEnabled: () => (feature('BUDDY') ? true : false),
  isHidden: false,
  // immediate=true：不等主循环队列 drain，斜杠命令立刻执行（与 brief、voice
  // 等其他轻交互命令一致的行为）。
  immediate: true,
  load: () =>
    Promise.resolve({
      async call(
        onDone: LocalJSXCommandOnDone,
        context: ToolUseContext & LocalJSXCommandContext,
        args: string,
      ) {
        // 运行期再守一次：理论上 isEnabled 已经过滤过，但命令可以被 REPL
        // 的 onSubmit('/buddy') 直接触发（PromptInput 的 footer 通过这条路径
        // 跳转），多一层 guard 更安全。
        if (!feature('BUDDY')) {
          onDone('Buddy is not enabled in this build.', { display: 'system' })
          return null
        }

        const [head = '', ...rest] = (args ?? '').trim().split(/\s+/)
        const tail = rest.join(' ').trim()

        switch (head) {
          case '': {
            // 主命令：没宠物 → hatch；有宠物 → 打印卡片
            const existing = getCompanion()
            if (!existing) {
              const fresh = hatch()
              onDone(`A companion appeared!\n\n${renderCard(fresh)}`, {
                display: 'system',
              })
              return null
            }
            onDone(renderCard(existing), { display: 'system' })
            return null
          }

          case 'pet': {
            const c = getCompanion()
            if (!c) {
              onDone('No companion yet — type /buddy to hatch one.', {
                display: 'system',
              })
              return null
            }
            // CompanionSprite 读 AppState.companionPetAt；PET_BURST_MS (2500)
            // 内在 sprite 上方逐帧渲染爱心
            context.setAppState(prev => ({
              ...prev,
              companionPetAt: Date.now(),
            }))
            onDone(`You gave ${c.name} some love.`, { display: 'system' })
            return null
          }

          case 'mute': {
            saveGlobalConfig(cfg => ({ ...cfg, companionMuted: true }))
            onDone('Companion muted. Run /buddy unmute to bring them back.', {
              display: 'system',
            })
            return null
          }

          case 'unmute': {
            saveGlobalConfig(cfg => {
              const { companionMuted: _m, ...rest2 } = cfg
              return rest2
            })
            onDone('Companion unmuted.', { display: 'system' })
            return null
          }

          case 'rename': {
            if (!tail) {
              onDone('Usage: /buddy rename <new name>', { display: 'system' })
              return null
            }
            const c = getCompanion()
            if (!c) {
              onDone('No companion yet — type /buddy to hatch one.', {
                display: 'system',
              })
              return null
            }
            const newName = tail.slice(0, MAX_NAME_LEN)
            saveGlobalConfig(cfg => {
              if (!cfg.companion) return cfg
              return { ...cfg, companion: { ...cfg.companion, name: newName } }
            })
            onDone(`Renamed to ${newName}.`, { display: 'system' })
            return null
          }

          case 'release': {
            const c = getCompanion()
            if (!c) {
              onDone('No companion to release.', { display: 'system' })
              return null
            }
            // 不用 delete——spread 里排除字段更安全（exactOptionalPropertyTypes
            // 严格模式下 companion: undefined 会被视为存在该字段）
            saveGlobalConfig(cfg => {
              const { companion: _c, ...rest2 } = cfg
              return rest2
            })
            onDone(
              `Released ${c.name} back into the wild. /buddy to hatch a new one.`,
              { display: 'system' },
            )
            return null
          }

          default: {
            onDone(
              `Unknown /buddy subcommand "${head}". Try: pet, mute, unmute, rename, release`,
              { display: 'system' },
            )
            return null
          }
        }
      },
    }),
} satisfies Command

export default buddy
