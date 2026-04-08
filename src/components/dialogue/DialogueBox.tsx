import { useEffect, useRef, useState } from 'react';
import type { Message } from './types';
import '../../index.css';

/**
 * 打字机效果组件：逐字输出文本。
 * - 若新 text 是旧 text 的延续（流式追加），从当前位置继续打，不重置。
 * - 若新 text 与旧 text 完全不同，则重置从头打。
 * - key={唯一标识} 可强制重置（用于消息气泡）。
 */
function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const stateRef = useRef({ target: text, pos: 0 });

  useEffect(() => {
    const cur = stateRef.current;
    if (text === cur.target) return;
    if (text.startsWith(cur.target)) {
      // 流式追加：继续从当前位置向后打
      cur.target = text;
    } else {
      // 全新文本：重置
      stateRef.current = { target: text, pos: 0 };
      setDisplayed('');
    }
  }, [text]);

  useEffect(() => {
    const cur = stateRef.current;
    if (cur.pos >= cur.target.length) return;
    const timer = setTimeout(() => {
      cur.pos += 1;
      setDisplayed(cur.target.slice(0, cur.pos));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, speed]);

  return <>{displayed}</>;
}

export interface DialogueBoxProps {
  /** 已完成的对话消息列表 */
  messages: Message[];
  /** 用户实时 ASR 流式文本（黄色气泡） */
  partialText?: string;
  /** AI 实时流式文本 */
  aiPartialText?: string;
  /** 界面语言，控制头部文案 */
  language?: 'zh' | 'en';

  // ── 资源 URL ─────────────────────────────────────────────────
  /** 用户头像图片 URL */
  userAvatarUrl?: string;
  /** AI 头像图片 URL */
  aiAvatarUrl?: string;
  /** 用户气泡背景图 URL（100% 100% 拉伸） */
  userBubbleBgUrl?: string;
  /** AI 气泡背景图 URL（文字 ≤ 5 字时使用） */
  aiBubbleBgUrl?: string;
  /** AI 气泡背景图 URL（文字 > 5 字时使用） */
  aiBubbleBgLongUrl?: string;

  // ── 打字机 ────────────────────────────────────────────────────
  /** 打字机速度（ms/字），默认 40 */
  typewriterSpeed?: number;

  // ── 容器 ─────────────────────────────────────────────────────
  /** 滚动容器 className */
  className?: string;
  /** 滚动容器 style */
  style?: React.CSSProperties;

  // ── 头像 ─────────────────────────────────────────────────────
  /** 头像 className（用户 & AI 共用） */
  avatarClassName?: string;
  /** 头像 style（用户 & AI 共用） */
  avatarStyle?: React.CSSProperties;

  // ── 名称标签 ─────────────────────────────────────────────────
  /** 名称文字 className */
  nameClassName?: string;
  /** 名称文字 style */
  nameStyle?: React.CSSProperties;

  // ── 用户气泡 ─────────────────────────────────────────────────
  /** 用户气泡 className */
  userBubbleClassName?: string;
  /** 用户气泡 style（会覆盖默认文字颜色 #FFF） */
  userBubbleStyle?: React.CSSProperties;

  // ── AI 气泡 ──────────────────────────────────────────────────
  /** AI 气泡 className */
  aiBubbleClassName?: string;
  /** AI 气泡 style（会覆盖默认文字颜色 #000） */
  aiBubbleStyle?: React.CSSProperties;

  // ── 实时文本 ─────────────────────────────────────────────────
  /** 实时文本颜色，用户与 AI 流式阶段共用，默认 #ffd54f（黄色） */
  partialTextColor?: string;
}

const DEFAULT_USER_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="16" fill="%234A90D9"/><circle cx="64" cy="48" r="24" fill="white"/><ellipse cx="64" cy="100" rx="36" ry="22" fill="white"/></svg>';

const DEFAULT_AI_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="16" fill="%23A855F7"/><circle cx="64" cy="48" r="24" fill="white"/><ellipse cx="64" cy="100" rx="36" ry="22" fill="white"/></svg>';

function BubbleBackground({
  bgUrl,
  fallbackColor,
}: {
  bgUrl?: string;
  fallbackColor: string;
}): React.CSSProperties {
  if (bgUrl) {
    return {
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: '100% 100%',
    };
  }
  return { background: fallbackColor };
}

export function DialogueBox({
  messages,
  partialText = '',
  aiPartialText = '',
  language = 'zh',
  userAvatarUrl = DEFAULT_USER_AVATAR,
  aiAvatarUrl = DEFAULT_AI_AVATAR,
  userBubbleBgUrl,
  aiBubbleBgUrl,
  aiBubbleBgLongUrl,
  typewriterSpeed = 40,
  className,
  style,
  avatarClassName,
  avatarStyle,
  nameClassName,
  nameStyle,
  userBubbleClassName,
  userBubbleStyle,
  aiBubbleClassName,
  aiBubbleStyle,
  partialTextColor = '#ffd54f',
}: DialogueBoxProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef(messages);
  const prevPartialTextRef = useRef(partialText);
  const prevAiPartialTextRef = useRef(aiPartialText);
  const [settledMessageIds, setSettledMessageIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, partialText, aiPartialText]);

  useEffect(() => {
    const prevMessages = prevMessagesRef.current;
    const prevPartialText = prevPartialTextRef.current;
    const prevAiPartialText = prevAiPartialTextRef.current;

    if (messages.length > prevMessages.length) {
      const appendedMessages = messages.slice(prevMessages.length);
      const nextSettledIds: number[] = [];

      if (prevPartialText && !partialText) {
        const finalizedUserMessage = appendedMessages.find(
          (msg) => msg.type === 'user' && msg.content === prevPartialText,
        );
        if (finalizedUserMessage) {
          nextSettledIds.push(finalizedUserMessage.id);
        }
      }

      if (prevAiPartialText && !aiPartialText) {
        const finalizedAiMessage = appendedMessages.find(
          (msg) => msg.type === 'ai' && msg.content === prevAiPartialText,
        );
        if (finalizedAiMessage) {
          nextSettledIds.push(finalizedAiMessage.id);
        }
      }

      if (nextSettledIds.length > 0) {
        setSettledMessageIds((prev) => {
          const next = new Set(prev);
          nextSettledIds.forEach((id) => next.add(id));
          return next;
        });
      }
    }

    prevMessagesRef.current = messages;
    prevPartialTextRef.current = partialText;
    prevAiPartialTextRef.current = aiPartialText;
  }, [messages, partialText, aiPartialText]);

  const totalCount = messages.length + (partialText ? 1 : 0);

  const containerClass = `relative flex h-[653px] w-[1000px] flex-col gap-10 overflow-y-auto dlg-no-scrollbar${className ? ' ' + className : ''}`;

  const baseAvatarClass = `w-32 h-32 rounded-2xl shrink-0 bg-gray-300${avatarClassName ? ' ' + avatarClassName : ''}`;
  const baseNameClass = `ml-5 text-[40px] text-[#213140]${nameClassName ? ' ' + nameClassName : ''}`;
  const baseUserBubbleClass = `p-10.5 min-h-32 text-[40px] leading-tight${userBubbleClassName ? ' ' + userBubbleClassName : ''}`;
  const baseAiBubbleClass = `p-10.5 min-h-32 text-[40px] leading-tight flex items-center${aiBubbleClassName ? ' ' + aiBubbleClassName : ''}`;

  const userName = language === 'zh' ? '用户' : 'User';
  const aiName = language === 'zh' ? 'AI助理' : 'AI Assistant';
  const userRealtimeName = language === 'zh' ? '用户(实时)' : 'User (Real-time)';
  const aiRealtimeName = language === 'zh' ? 'AI助理(实时)' : 'AI Assistant (Real-time)';

  return (
    <div ref={listRef} className={containerClass} style={style}>
      {messages.map((msg, index) => {
        const isThirdLast = index === totalCount - 3;
        const isOlder = index < totalCount - 3;
        const isLatest = index === totalCount - 1;

        let opacityClass = 'opacity-100';
        if (isThirdLast) opacityClass = 'opacity-50';
        if (isOlder) opacityClass = 'opacity-0';
        const animClass = isLatest ? 'animate-slide-in-up' : '';

        const isUser = msg.type === 'user';
        const avatarUrl = isUser ? userAvatarUrl : aiAvatarUrl;

        const bubbleBg: React.CSSProperties = isUser
          ? BubbleBackground({ bgUrl: userBubbleBgUrl, fallbackColor: '#4A90D9' })
          : BubbleBackground({
              bgUrl: msg.content.length <= 5 ? aiBubbleBgUrl : aiBubbleBgLongUrl,
              fallbackColor: '#E8E8E8',
            });

        return (
          <div
            key={msg.id}
            className={`flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 ${opacityClass} ${animClass}`}
          >
            <div
              className={baseAvatarClass}
              style={{
                backgroundImage: `url(${avatarUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...avatarStyle,
              }}
            />
            <div className="flex max-w-[80%] flex-col items-start gap-2">
              <div className={baseNameClass} style={nameStyle}>{msg.name || (isUser ? userName : aiName)}</div>
              <div
                className={isUser ? baseUserBubbleClass : baseAiBubbleClass}
                style={{
                  ...bubbleBg,
                  color: isUser ? '#FFFFFF' : '#000',
                  ...(isUser ? userBubbleStyle : aiBubbleStyle),
                }}
              >
                {settledMessageIds.has(msg.id) ? msg.content : <TypewriterText key={msg.id} text={msg.content} speed={typewriterSpeed} />}
              </div>
            </div>
          </div>
        );
      })}

      {/* 用户实时 ASR 气泡 */}
      {partialText && (
        <div className="flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 opacity-100 animate-slide-in-up">
          <div
            className={baseAvatarClass}
            style={{
              backgroundImage: `url(${userAvatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...avatarStyle,
            }}
          />
          <div className="flex max-w-[80%] flex-col items-start gap-2">
            <div className={baseNameClass} style={nameStyle}>{userRealtimeName}</div>
            <div
              className={baseUserBubbleClass}
              style={{
                ...BubbleBackground({ bgUrl: userBubbleBgUrl, fallbackColor: '#4A90D9' }),
                color: '#FFFFFF',
                ...userBubbleStyle,
              }}
            >
              <div style={{ color: partialTextColor }}>
                <TypewriterText text={partialText} speed={typewriterSpeed} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI 实时流式气泡 */}
      {aiPartialText && (
        <div className="flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 opacity-100 animate-slide-in-up">
          <div
            className={baseAvatarClass}
            style={{
              backgroundImage: `url(${aiAvatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...avatarStyle,
            }}
          />
          <div className="flex max-w-[80%] flex-col items-start gap-2">
            <div className={baseNameClass} style={nameStyle}>{aiRealtimeName}</div>
            <div
              className={baseAiBubbleClass}
              style={{
                ...BubbleBackground({
                  bgUrl: aiPartialText.length <= 5 ? aiBubbleBgUrl : aiBubbleBgLongUrl,
                  fallbackColor: '#E8E8E8',
                }),
                color: '#000',
                ...aiBubbleStyle,
              }}
            >
              <div style={{ color: partialTextColor }}>
                <TypewriterText text={aiPartialText} speed={typewriterSpeed} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
