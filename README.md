# ai-dialogue-react

一个面向 AI 对话场景的 React UI 组件，当前导出一个核心组件：`DialogueBox`。

它支持这些能力：

- AI / 用户双角色消息展示
- 用户实时语音识别文本 `partialText`
- AI 流式输出文本 `aiPartialText`
- 打字机逐字显示
- 头像、气泡背景、文本样式自定义
- 自动注入基础动画样式，无需额外引入组件 CSS 文件

## 1. 安装

```bash
npm i ai-dialogue-react
```

如果你的项目还没有启用 Tailwind CSS，需要一并安装并配置。

```bash
npm i tailwindcss @tailwindcss/vite
```

## 2. 前置条件：启用 Tailwind CSS

这个组件内部使用了 Tailwind 工具类来完成布局和尺寸控制，所以宿主项目必须启用 Tailwind CSS，否则组件结构能渲染出来，但大部分视觉样式不会生效。

### Vite 项目最小配置

`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`src/index.css`

```css
@import "tailwindcss";
@source "../node_modules/ai-dialogue-react/dist/**/*.{js,ts,jsx,tsx}";
```

说明：

- `@import "tailwindcss";` 用于启用 Tailwind CSS。
- `@source` 很重要，用来让 Tailwind 扫描 `ai-dialogue-react` 包内的类名；不加这一行时，组件里的 Tailwind 类通常不会被生成。
- 如果你的项目已经接入 Tailwind，只需要补上针对 `ai-dialogue-react` 的扫描配置即可。

## 3. 最小可运行示例

```tsx
import { useEffect, useRef, useState } from 'react'
import { DialogueBox, type Message } from 'ai-dialogue-react'

const TYPEWRITER_SPEED = 30
const MESSAGE_SETTLE_DELAY = 300
const getTypingDuration = (text: string) => Math.max(text.length * TYPEWRITER_SPEED + 200, 900)
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'user',
    name: '用户',
    content: '你好，请介绍一下你自己。',
  },
  {
    id: 2,
    type: 'ai',
    name: '数字人',
    content: '你好，我是 AI 助理，可以帮助你完成问答与讲解。',
  },
]

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [partialText, setPartialText] = useState('')
  const [aiPartialText, setAiPartialText] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const simulationIdRef = useRef(0)

  useEffect(() => {
    return () => {
      simulationIdRef.current += 1
    }
  }, [])

  const mockUserSpeaking = async () => {
    if (isSimulating) return

    const userText = '我想了解一下这个组件怎么接入项目'
    const aiText = '你可以先安装 npm 包，然后在页面中引入 DialogueBox 组件。'
    const simulationId = simulationIdRef.current + 1
    simulationIdRef.current = simulationId
    setIsSimulating(true)
    setAiPartialText('')
    setPartialText(userText)

    try {
      await wait(getTypingDuration(userText))
      if (simulationIdRef.current !== simulationId) return

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'user',
          name: '用户',
          content: userText,
        },
      ])
      setPartialText('')

      await wait(MESSAGE_SETTLE_DELAY)
      if (simulationIdRef.current !== simulationId) return

      setAiPartialText(aiText)

      await wait(getTypingDuration(aiText))
      if (simulationIdRef.current !== simulationId) return

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          name: '数字人',
          content: aiText,
        },
      ])
      setAiPartialText('')
    } finally {
      if (simulationIdRef.current === simulationId) {
        setIsSimulating(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <button
        type="button"
        onClick={mockUserSpeaking}
        disabled={isSimulating}
        className="mb-6 rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        模拟一轮对话
      </button>

      <DialogueBox
        messages={messages}
        partialText={partialText}
        aiPartialText={aiPartialText}
        language="zh"
        className="h-[70vh] w-full overflow-y-auto rounded-3xl bg-white/70 p-6 shadow-xl dlg-no-scrollbar"
        typewriterSpeed={TYPEWRITER_SPEED}
      />
    </div>
  )
}
```

## 4. 基本使用方式

最关键的是维护三个数据源：

- `messages`：已经完成的正式消息列表
- `partialText`：用户正在说话时的实时文本
- `aiPartialText`：AI 正在流式生成时的实时文本

推荐的更新时机：

1. 用户说话过程中，持续更新 `partialText`
2. 用户一句话结束后，把最终文本 push 到 `messages`，然后清空 `partialText`
3. AI 返回过程中，持续更新 `aiPartialText`
4. AI 返回结束后，把最终文本 push 到 `messages`，然后清空 `aiPartialText`

## 5. 数据结构

```ts
export interface Message {
  id: number
  type: 'ai' | 'user'
  name: string
  content: string
}
```

字段说明：

- `id`：消息唯一标识，建议始终保持唯一
- `type`：消息角色，只能是 `user` 或 `ai`
- `name`：显示名称；如果传空值，组件会根据 `language` 自动回退为默认名称
- `content`：消息正文

## 6. 常用 Props

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `messages` | `Message[]` | 已完成的正式消息列表 |
| `partialText` | `string` | 用户实时 ASR 文本 |
| `aiPartialText` | `string` | AI 实时流式文本 |
| `language` | `'zh' \| 'en'` | 名称标签语言 |
| `typewriterSpeed` | `number` | 打字机速度，单位 ms/字，默认 `40` |
| `userAvatarUrl` | `string` | 用户头像图片地址 |
| `aiAvatarUrl` | `string` | AI 头像图片地址 |
| `userBubbleBgUrl` | `string` | 用户气泡背景图 |
| `aiBubbleBgUrl` | `string` | AI 短文本气泡背景图 |
| `aiBubbleBgLongUrl` | `string` | AI 长文本气泡背景图 |
| `className` | `string` | 外层滚动容器类名 |
| `style` | `CSSProperties` | 外层滚动容器样式 |
| `avatarClassName` | `string` | 头像类名 |
| `avatarStyle` | `CSSProperties` | 头像样式 |
| `nameClassName` | `string` | 名称文本类名 |
| `nameStyle` | `CSSProperties` | 名称文本样式 |
| `userBubbleClassName` | `string` | 用户气泡类名 |
| `userBubbleStyle` | `CSSProperties` | 用户气泡样式 |
| `aiBubbleClassName` | `string` | AI 气泡类名 |
| `aiBubbleStyle` | `CSSProperties` | AI 气泡样式 |
| `partialTextColor` | `string` | 实时文本颜色，用户与 AI 流式阶段共用，默认 `#ffd54f` |

## 7. 自定义头像和背景图

```tsx
<DialogueBox
  messages={messages}
  userAvatarUrl="/image/user-avatar.png"
  aiAvatarUrl="/image/ai-avatar.png"
  userBubbleBgUrl="/image/user-bubble.png"
  aiBubbleBgUrl="/image/ai-bubble-short.png"
  aiBubbleBgLongUrl="/image/ai-bubble-long.png"
/>
```

如果不传头像，组件会使用内置的默认 SVG 头像。

## 8. 使用注意事项

### 默认尺寸偏大

组件默认容器类名是：

```txt
relative w-[1000px] h-[653px] overflow-y-auto flex flex-col gap-10 dlg-no-scrollbar
```

这更适合大屏、数字人展示页，不太适合直接放进移动端或普通表单页。实际项目里通常建议你传入自己的 `className` 或 `style` 覆盖默认尺寸。

### 旧消息会自动弱化

这个组件当前并不是传统 IM 样式的“完整聊天记录”组件。它会重点突出最近几条对话：

- 更早的消息会被隐藏
- 倒数第三条消息会半透明显示
- 最新消息会带入场动画

所以它更适合数字人讲解、大屏播报、实时对话展示，而不是客服聊天窗口那种完整历史列表。

### 不需要额外引入组件 CSS 文件

组件内部会自动注入滚动条隐藏和入场动画相关样式，但 Tailwind 工具类仍然必须由你的项目来生成。

## 9. 导出内容

```ts
export { DialogueBox } from 'ai-dialogue-react'
export type { DialogueBoxProps, Message } from 'ai-dialogue-react'
```

## 10. 构建本库

```bash
pnpm run build:lib
```

## 11. 下载组件源码

如果你希望查看、修改或二次开发组件源码，建议直接从 GitHub 仓库拉取完整项目。

### 方式一：使用 Git 克隆仓库

```bash
git clone https://github.com/你的用户名/ai-dialogue-react.git
cd ai-dialogue-react
pnpm install
pnpm run build:lib
```

构建完成后，产物会输出到 `dist` 目录。

### 方式二：在 GitHub 页面下载 ZIP

1. 打开本仓库的 GitHub 页面
2. 点击 `Code`
3. 点击 `Download ZIP`
4. 解压后进入项目目录
5. 执行安装与构建命令：

```bash
pnpm install
pnpm run build:lib
```

### 源码目录说明

- `src/index.ts`：组件导出入口
- `src/components/dialogue/`：核心组件源码目录
- `registry/dialogue-box/`：对外注册导出目录
- `dist/`：构建后的发布产物目录

如果你只是想在项目中使用组件，直接执行 `npm i ai-dialogue-react` 即可；如果你需要查看实现、修改样式或参与开发，再下载源码更合适。
