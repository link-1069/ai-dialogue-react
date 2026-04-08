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