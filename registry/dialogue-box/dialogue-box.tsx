import { useEffect, useRef, useState, type CSSProperties } from 'react';

/* ── Injected styles (no external CSS file needed) ──────────────────────── */
const STYLES = [
  '.dlg-no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}',
  '.dlg-no-scrollbar::-webkit-scrollbar{display:none}',
  '@keyframes dlg-slide-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
  '.dlg-slide-in-up{animation:.5s ease-out forwards dlg-slide-in-up}',
].join('');

function useDialogueBoxStyles() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = '__dialogue-box-styles__';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = STYLES;
    document.head.appendChild(el);
  }, []);
}

/* ── Types ──────────────────────────────────────────────────────────────── */
export interface Message {
  id: number;
  type: 'ai' | 'user';
  name: string;
  content: string;
}

/* ── Props ──────────────────────────────────────────────────────────────── */
export interface DialogueBoxProps {
  /** 已完成的对话消息列表 */
  messages: Message[];
  /** 用户实时 ASR 流式文本（彩色气泡） */
  partialText?: string;
  /** AI 实时流式文本 */
  aiPartialText?: string;
  /** 界面语言，控制名称标签文案 */
  language?: 'zh' | 'en';

  // ── 资源 URL ─────────────────────────────────────────────────
  /** 用户头像图片 URL */
  userAvatarUrl?: string;
  /** AI 头像图片 URL */
  aiAvatarUrl?: string;
  /** 用户气泡背景图 URL（100% 100% 拉伸） */
  userBubbleBgUrl?: string;
  /** AI 气泡背景图 URL（文字 ≤ 5 字时） */
  aiBubbleBgUrl?: string;
  /** AI 气泡背景图 URL（文字 > 5 字时） */
  aiBubbleBgLongUrl?: string;

  // ── 打字机 ────────────────────────────────────────────────────
  /** 打字机速度（ms/字），默认 40 */
  typewriterSpeed?: number;

  // ── 容器 ─────────────────────────────────────────────────────
  /** 滚动容器 className */
  className?: string;
  /** 滚动容器 style */
  style?: CSSProperties;

  // ── 头像 ─────────────────────────────────────────────────────
  /** 头像 className（用户 & AI 共用） */
  avatarClassName?: string;
  /** 头像 style（追加在默认背景图之后） */
  avatarStyle?: CSSProperties;

  // ── 名称标签 ─────────────────────────────────────────────────
  /** 名称文字 className */
  nameClassName?: string;
  /** 名称文字 style */
  nameStyle?: CSSProperties;

  // ── 用户气泡 ─────────────────────────────────────────────────
  /** 用户气泡 className */
  userBubbleClassName?: string;
  /** 用户气泡 style（会覆盖默认文字颜色 #FFF） */
  userBubbleStyle?: CSSProperties;

  // ── AI 气泡 ──────────────────────────────────────────────────
  /** AI 气泡 className */
  aiBubbleClassName?: string;
  /** AI 气泡 style（会覆盖默认文字颜色 #000） */
  aiBubbleStyle?: CSSProperties;

  // ── 实时文本 ─────────────────────────────────────────────────
  /** 实时文本颜色，用户与 AI 流式阶段共用，默认 #ffd54f（黄色） */
  partialTextColor?: string;
}

/* ── Internal helpers ───────────────────────────────────────────────────── */
const DEFAULT_USER_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="16" fill="%234A90D9"/><circle cx="64" cy="48" r="24" fill="white"/><ellipse cx="64" cy="100" rx="36" ry="22" fill="white"/></svg>';

const DEFAULT_AI_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="16" fill="%23A855F7"/><circle cx="64" cy="48" r="24" fill="white"/><ellipse cx="64" cy="100" rx="36" ry="22" fill="white"/></svg>';

function bgStyle(url: string | undefined, fallback: string): CSSProperties {
  return url
    ? { backgroundImage: `url(${url})`, backgroundSize: '100% 100%' }
    : { background: fallback };
}

function cls(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ');
}

/* ── Typewriter ─────────────────────────────────────────────────────────── */
function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const stateRef = useRef({ target: text, pos: 0 });

  useEffect(() => {
    const cur = stateRef.current;
    if (text === cur.target) return;
    if (text.startsWith(cur.target)) {
      cur.target = text; // 流式追加：继续往后打
    } else {
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

/* ── DialogueBox ────────────────────────────────────────────────────────── */
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
  useDialogueBoxStyles();

  const listRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef(messages);
  const prevPartialTextRef = useRef(partialText);
  const prevAiPartialTextRef = useRef(aiPartialText);
  const [settledMessageIds, setSettledMessageIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
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

  const containerCls = cls(
    'relative flex h-[653px] w-[1000px] flex-col gap-10 overflow-y-auto dlg-no-scrollbar',
    className,
  );

  const t = {
    user: language === 'zh' ? '用户' : 'User',
    ai: language === 'zh' ? 'AI助理' : 'AI Assistant',
    userLive: language === 'zh' ? '用户(实时)' : 'User (Real-time)',
    aiLive: language === 'zh' ? 'AI助理(实时)' : 'AI Assistant (Real-time)',
  };

  const avatarCls = cls('w-32 h-32 rounded-2xl shrink-0 bg-gray-300', avatarClassName);
  const nameCls = cls('ml-5 text-[40px] text-[#213140]', nameClassName);
  const userBubbleCls = cls('p-10.5 min-h-32 text-[40px] leading-tight', userBubbleClassName);
  const aiBubbleCls = cls('p-10.5 min-h-32 text-[40px] leading-tight flex items-center', aiBubbleClassName);

  return (
    <div ref={listRef} className={containerCls} style={style}>
      {messages.map((msg, index) => {
        const isOlder = index < totalCount - 3;
        const isThirdLast = index === totalCount - 3;
        const isLatest = index === totalCount - 1;
        const isUser = msg.type === 'user';

        const opacityCls = isOlder ? 'opacity-0' : isThirdLast ? 'opacity-50' : 'opacity-100';
        const animCls = isLatest ? 'dlg-slide-in-up' : '';

        return (
          <div
            key={msg.id}
            className={cls(
              'flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0',
              opacityCls,
              animCls,
            )}
          >
            <div
              className={avatarCls}
              style={{
                backgroundImage: `url(${isUser ? userAvatarUrl : aiAvatarUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...avatarStyle,
              }}
            />
            <div className="flex max-w-[80%] flex-col items-start gap-2">
              <div className={nameCls} style={nameStyle}>
                {msg.name || (isUser ? t.user : t.ai)}
              </div>
              <div
                className={isUser ? userBubbleCls : aiBubbleCls}
                style={{
                  ...bgStyle(
                    isUser
                      ? userBubbleBgUrl
                      : msg.content.length <= 5
                        ? aiBubbleBgUrl
                        : aiBubbleBgLongUrl,
                    isUser ? '#4A90D9' : '#E8E8E8',
                  ),
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
        <div className="flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 opacity-100 dlg-slide-in-up">
          <div
            className={avatarCls}
            style={{
              backgroundImage: `url(${userAvatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...avatarStyle,
            }}
          />
          <div className="flex max-w-[80%] flex-col items-start gap-2">
            <div className={nameCls} style={nameStyle}>{t.userLive}</div>
            <div
              className={userBubbleCls}
              style={{
                ...bgStyle(userBubbleBgUrl, '#4A90D9'),
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
        <div className="flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 opacity-100 dlg-slide-in-up">
          <div
            className={avatarCls}
            style={{
              backgroundImage: `url(${aiAvatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...avatarStyle,
            }}
          />
          <div className="flex max-w-[80%] flex-col items-start gap-2">
            <div className={nameCls} style={nameStyle}>{t.aiLive}</div>
            <div
              className={aiBubbleCls}
              style={{
                ...bgStyle(
                  aiPartialText.length <= 5 ? aiBubbleBgUrl : aiBubbleBgLongUrl,
                  '#E8E8E8',
                ),
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
