import { CSSProperties } from 'react';
export interface Message {
    id: number;
    type: 'ai' | 'user';
    name: string;
    content: string;
}
export interface DialogueBoxProps {
    /** 已完成的对话消息列表 */
    messages: Message[];
    /** 用户实时 ASR 流式文本（彩色气泡） */
    partialText?: string;
    /** AI 实时流式文本 */
    aiPartialText?: string;
    /** 界面语言，控制名称标签文案 */
    language?: 'zh' | 'en';
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
    /** 打字机速度（ms/字），默认 40 */
    typewriterSpeed?: number;
    /** 滚动容器 className */
    className?: string;
    /** 滚动容器 style */
    style?: CSSProperties;
    /** 头像 className（用户 & AI 共用） */
    avatarClassName?: string;
    /** 头像 style（追加在默认背景图之后） */
    avatarStyle?: CSSProperties;
    /** 名称文字 className */
    nameClassName?: string;
    /** 名称文字 style */
    nameStyle?: CSSProperties;
    /** 用户气泡 className */
    userBubbleClassName?: string;
    /** 用户气泡 style（会覆盖默认文字颜色 #FFF） */
    userBubbleStyle?: CSSProperties;
    /** AI 气泡 className */
    aiBubbleClassName?: string;
    /** AI 气泡 style（会覆盖默认文字颜色 #000） */
    aiBubbleStyle?: CSSProperties;
    /** 实时文本颜色，用户与 AI 流式阶段共用，默认 #ffd54f（黄色） */
    partialTextColor?: string;
}
export declare function DialogueBox({ messages, partialText, aiPartialText, language, userAvatarUrl, aiAvatarUrl, userBubbleBgUrl, aiBubbleBgUrl, aiBubbleBgLongUrl, typewriterSpeed, className, style, avatarClassName, avatarStyle, nameClassName, nameStyle, userBubbleClassName, userBubbleStyle, aiBubbleClassName, aiBubbleStyle, partialTextColor, }: DialogueBoxProps): import("react/jsx-runtime").JSX.Element;
