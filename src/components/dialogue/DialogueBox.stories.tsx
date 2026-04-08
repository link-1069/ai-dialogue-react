import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialogueBox } from './DialogueBox';
import type { Message } from './types';

const meta = {
  title: 'Dialogue/DialogueBox',
  component: DialogueBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '对话框组件，支持 AI / 用户双方消息气泡、实时 ASR 文本、AI 流式文本，所有视觉元素均可通过 props 自定义。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // ── 数据 ───────────────────────────────────────────────────
    language: {
      control: 'radio',
      options: ['zh', 'en'],
      description: '界面语言，控制名称标签文案',
      table: { category: '数据' },
    },
    partialText: {
      control: 'text',
      description: '用户实时 ASR 流式文本（显示为黄色气泡）',
      table: { category: '数据' },
    },
    aiPartialText: {
      control: 'text',
      description: 'AI 实时流式文本',
      table: { category: '数据' },
    },

    // ── 资源 URL ───────────────────────────────────────────────
    userAvatarUrl: {
      control: 'text',
      description: '用户头像图片 URL',
      table: { category: '资源 URL' },
    },
    aiAvatarUrl: {
      control: 'text',
      description: 'AI 头像图片 URL',
      table: { category: '资源 URL' },
    },
    userBubbleBgUrl: {
      control: 'text',
      description: '用户气泡背景图 URL（100% 100% 拉伸）',
      table: { category: '资源 URL' },
    },
    aiBubbleBgUrl: {
      control: 'text',
      description: 'AI 气泡背景图 URL（文字 ≤ 5 字时）',
      table: { category: '资源 URL' },
    },
    aiBubbleBgLongUrl: {
      control: 'text',
      description: 'AI 气泡背景图 URL（文字 > 5 字时）',
      table: { category: '资源 URL' },
    },

    // ── 打字机 ─────────────────────────────────────────────────
    typewriterSpeed: {
      control: { type: 'range', min: 10, max: 300, step: 10 },
      description: '打字机速度（ms / 字），默认 40ms',
      table: { category: '打字机', defaultValue: { summary: '40' } },
    },

    // ── 容器样式 ───────────────────────────────────────────────
    className: {
      control: 'text',
      description: '滚动容器 className（覆盖默认定位与尺寸）',
      table: { category: '容器样式' },
    },
    style: {
      control: 'object',
      description: '滚动容器 style',
      table: { category: '容器样式' },
    },

    // ── 头像样式 ───────────────────────────────────────────────
    avatarClassName: {
      control: 'text',
      description: '头像 className（用户 & AI 共用）',
      table: { category: '头像样式' },
    },
    avatarStyle: {
      control: 'object',
      description: '头像 style（用户 & AI 共用，追加在默认背景之后）',
      table: { category: '头像样式' },
    },

    // ── 名称标签样式 ───────────────────────────────────────────
    nameClassName: {
      control: 'text',
      description: '名称文字 className',
      table: { category: '名称标签样式' },
    },
    nameStyle: {
      control: 'object',
      description: '名称文字 style',
      table: { category: '名称标签样式' },
    },

    // ── 用户气泡样式 ───────────────────────────────────────────
    userBubbleClassName: {
      control: 'text',
      description: '用户气泡 className',
      table: { category: '用户气泡样式' },
    },
    userBubbleStyle: {
      control: 'object',
      description: '用户气泡 style（会覆盖默认文字颜色 #FFF）',
      table: { category: '用户气泡样式' },
    },

    // ── AI 气泡样式 ────────────────────────────────────────────
    aiBubbleClassName: {
      control: 'text',
      description: 'AI 气泡 className',
      table: { category: 'AI 气泡样式' },
    },
    aiBubbleStyle: {
      control: 'object',
      description: 'AI 气泡 style（会覆盖默认文字颜色 #000）',
      table: { category: 'AI 气泡样式' },
    },

    // ── 实时文本样式 ───────────────────────────────────────────
    partialTextColor: {
      control: 'color',
      description: '实时文本颜色，用户与 AI 流式阶段共用，默认 #ffd54f（黄色）',
      table: { category: '实时文本样式', defaultValue: { summary: '#ffd54f' } },
    },
  },
} satisfies Meta<typeof DialogueBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const containerClass = 'bg-gray-100 p-4 rounded-xl';

const sharedImageProps = {
  userAvatarUrl: '/image/nantouxiang@1x.png',
  aiAvatarUrl: '/image/nvtouxiang@1x.png',
  userBubbleBgUrl: '/image/userbg.png',
  aiBubbleBgUrl: '/image/aibg.png',
  aiBubbleBgLongUrl: '/image/aibg2.png',
};

/** 样式自定义演示 — 覆盖颜色、字体、头像圆角等 */
export const CustomStyles: Story = {
  name: '样式自定义演示',
  args: {
    ...sharedImageProps,
    messages: [
      { id: 1, type: 'ai',   name: 'AI助理', content: '您好，这是自定义样式展示' },
      { id: 2, type: 'user', name: '用户',   content: '看起来很酷！' },
    ],
    partialText: '正在输入…',
    language: 'zh',
    typewriterSpeed: 80,
    partialTextColor: '#00e5ff',
    // 容器
    className: containerClass,
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '16px', padding: '16px' },
    // 头像
    avatarStyle: { borderRadius: '50%', border: '3px solid #764ba2' },
    // 名称
    nameStyle: { color: '#c084fc', fontSize: '32px' },
    // 用户气泡
    userBubbleStyle: { background: 'linear-gradient(90deg, #667eea, #764ba2)', color: '#fff', borderRadius: '12px' },
    // AI 气泡
    aiBubbleStyle: { background: '#1e3a5f', color: '#e0f0ff', borderRadius: '12px' },
  },
};

// ── 模拟对话脚本 ──────────────────────────────────────────────
const simulatedScript: Message[] = [
  { id: 1, type: 'ai',   name: 'AI助理', content: '您好，欢迎使用智能助理！请问有什么可以帮您？' },
  { id: 2, type: 'user', name: '用户',   content: '你好，我想了解一下你们的AI服务' },
  { id: 3, type: 'ai',   name: 'AI助理', content: '我们提供智能对话、图像生成、语音识别等多项AI能力' },
  { id: 4, type: 'user', name: '用户',   content: '听起来不错，图像生成是怎么用的？' },
  { id: 5, type: 'ai',   name: 'AI助理', content: '您只需描述想要的画面，系统会自动生成对应的高质量图片' },
  { id: 6, type: 'user', name: '用户',   content: '太棒了，我想试试！' },
];

const simulatedConversationTutorial = `
import { useEffect, useState } from 'react';
import { DialogueBox, type Message } from 'ai-dialogue-react';

const sharedImageProps = {
  userAvatarUrl: '/image/nantouxiang@1x.png',
  aiAvatarUrl: '/image/nvtouxiang@1x.png',
  userBubbleBgUrl: '/image/userbg.png',
  aiBubbleBgUrl: '/image/aibg.png',
  aiBubbleBgLongUrl: '/image/aibg2.png',
};

const script: Message[] = [
  { id: 1, type: 'ai', name: 'AI助理', content: '您好，欢迎使用智能助理！请问有什么可以帮您？' },
  { id: 2, type: 'user', name: '用户', content: '你好，我想了解一下你们的AI服务' },
  { id: 3, type: 'ai', name: 'AI助理', content: '我们提供智能对话、图像生成、语音识别等多项AI能力' },
];

export function Demo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= script.length) return;

    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, script[step]]);
      setStep((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <DialogueBox
      {...sharedImageProps}
      messages={messages}
      language="zh"
      className="relative h-125 w-200 overflow-y-auto rounded-xl bg-gray-100 p-4"
    />
  );
}
`;

function SimulatedDialogue() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= simulatedScript.length) return;
    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, simulatedScript[step]]);
      setStep((s) => s + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <DialogueBox
      {...sharedImageProps}
      messages={messages}
      language="zh"
      className={containerClass}
    />
  );
}

/** 模拟对话 — 每隔 1 秒弹出一条，共 6 条 */
export const SimulatedConversation: Story = {
  name: 'simulated-conversation',
  parameters: {
    docs: {
      description: {
        story: [
          '### 使用教程',
          '',
          '1. 从 `ai-dialogue-react` 导入 `DialogueBox` 和 `Message` 类型。',
          '2. 用 `messages` 状态保存已完成的对话记录。',
          '3. 准备一个脚本数组，按时间逐条追加到 `messages`。',
          '4. 通过 `userAvatarUrl`、`aiAvatarUrl`、`userBubbleBgUrl` 等资源参数接入你的视觉素材。',
          '5. 给组件容器传入固定宽高和滚动样式，保证对话区域按预期展示。',
          '',
          '下面的代码示例就是这个 Story 的最小接入版本，可以直接改成你自己的接口数据或 WebSocket 流式消息逻辑。',
        ].join('\n'),
      },
      source: {
        code: simulatedConversationTutorial,
        language: 'tsx',
      },
    },
  },
  render: () => <SimulatedDialogue />,
  args: { messages: [] },
};
