'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

import { OnnebookLogo } from '@/components/ui/logo';
import { TextShimmer } from '@/components/ui/shimmer-text';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AssistantChatTheme =
  | 'webchat'
  | 'whatsapp'
  | 'instagram'
  | 'messenger';

type ThemeStyles = {
  container: string;
  header: string;
  badge: string;
  avatarUser: string;
  avatarAssistant: string;
  bubble?: string;
  bubbleUser: string;
  bubbleAssistant: string;
  input: string;
  button: string;
  title: string;
  inputContainer: string;
  messagesArea?: string;
};

const THEME_STYLES: Record<AssistantChatTheme, ThemeStyles> = {
  webchat: {
    container: 'bg-card text-card-foreground',
    header: 'bg-card',
    badge: 'bg-primary/5 text-primary',
    messagesArea: 'border-y-4 border-border/40',
    avatarUser: 'bg-border/30 text-muted-foreground max-md:hidden',
    avatarAssistant: 'bg-foreground/5 text-foreground/90 max-md:hidden',
    bubbleUser: 'bg-border/30 text-foreground/90',
    bubbleAssistant: 'bg-foreground/5 text-foreground/90',
    input: 'bg-border/40',
    button: '',
    title: 'text-foreground',
    inputContainer: 'bg-card',
  },
  whatsapp: {
    container: cn(
      'bg-[#e5ddd5] text-black',
      'dark:bg-[#0C0A0D] dark:text-white',
    ),
    header: cn('bg-[#075E54] text-white', 'dark:bg-[#161717] dark:text-white'),
    badge: cn('bg-white/5 text-white', 'dark:bg-white/5 dark:text-white'),
    messagesArea: 'px-2',
    avatarUser: cn(
      'max-md:hidden',
      'bg-[#dcf8c6] text-black',
      'dark:bg-[#144d37] dark:text-white',
    ),
    avatarAssistant: cn(
      'max-md:hidden',
      'bg-white text-black',
      'dark:bg-[#242626] dark:text-white',
    ),
    bubbleAssistant: cn(
      'bg-[#dcf8c6] text-black',
      'dark:bg-[#144d37] dark:text-white',
    ),
    bubbleUser: cn('bg-white text-black', 'dark:bg-[#242626] dark:text-white'),
    input: cn(
      'bg-white text-black placeholder:text-[#6b7280]',
      'dark:bg-[#242626] dark:text-white dark:placeholder:text-white/50',
    ),
    button: cn(
      'hover:brightness-110',
      'bg-[#25D366] text-white',
      'dark:bg-[#21c063] dark:text-white',
    ),
    title: 'text-white',
    inputContainer: 'bg-transparent',
  },
  instagram: {
    container: cn('bg-white text-black', 'dark:bg-black dark:text-white'),
    header: cn('bg-border/40 text-black', 'dark:bg-black dark:text-white'),
    badge: cn('bg-black/5 text-black', 'dark:bg-[#161717] dark:text-white'),
    messagesArea: cn(
      '[--gap:16px] messenger-container',
      '[--gradient-start:#0070f6] [--gradient-end:#aa00ff]',
      '[--background:white]',
      'dark:[--background:black]',
    ),
    avatarUser: 'hidden',
    avatarAssistant: 'hidden',
    bubble: cn('[--background:white]', 'dark:[--background:black]'),
    bubbleUser: 'messenger-bubble primary',
    bubbleAssistant: cn(
      '[--background-assistant:var(--border)]',
      'dark:[--background-assistant:#303030]',
      'messenger-bubble',
    ),
    input: cn(
      'bg-zinc-200 text-black placeholder:text-black/50',
      'dark:bg-[#262626] dark:text-white dark:text-white dark:placeholder:text-white/50',
    ),
    button: cn(
      'bg-fuchsia-600 text-white',
      'dark:bg-fuchsia-600 dark:text-white',
    ),
    title: 'text-foreground',
    inputContainer: 'bg-transparent',
  },
  messenger: {
    container: cn(
      'relative',
      'bg-white text-black',
      'dark:bg-[#242526] dark:text-white',
    ),
    header: cn('bg-border/40 text-black', 'dark:bg-black dark:text-white'),
    badge: cn('bg-white/20 text-white', 'dark:bg-black dark:text-white'),
    messagesArea: cn(
      '[--gap:16px] messenger-container',
      '[--gradient-start:#0070f6] [--gradient-end:#aa00ff]',
      '[--background:white]',
      'dark:[--background:#242526]',
    ),
    avatarUser: 'hidden',
    avatarAssistant: 'hidden',
    bubble: cn('[--background:white]', 'dark:[--background:#242526]'),
    bubbleUser: 'messenger-bubble primary',
    bubbleAssistant: cn(
      '[--background-assistant:var(--border)]',
      'dark:[--background-assistant:#303030]',
      'messenger-bubble',
    ),
    input: cn(
      'bg-zinc-200 text-black placeholder:text-black/50',
      'dark:bg-[#262626] dark:text-white dark:text-white dark:placeholder:text-white/50',
    ),
    button: cn('bg-[#0084FF] text-white', 'dark:bg-[#0084FF] dark:text-white'),
    title: 'text-foreground',
    inputContainer: 'bg-transparent',
  },
};

export const AssistantChat = ({
  theme = 'webchat',
  // icon,
  name: _name,
  disabled = false,
  messages = [],
  className,
}: {
  theme?: AssistantChatTheme;
  icon: React.ReactNode;
  name: string;
  disabled?: boolean;
  messages?: ChatMessage[];
  className?: string;
}) => {
  
  const styles = THEME_STYLES[theme];

  const scrollRef = useRef<HTMLUListElement | null>(null);

  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);

  const [messagesKey, setMessagesKey] = useState<string>('');

  const [hasInitialized, setHasInitialized] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const isBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;

    setIsAtBottom(isBottom);
  };

  const [messageStates, setMessageStates] = useState<
    Record<number, 'typing' | 'completed'>
  >({});

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newMessagesKey = JSON.stringify(messages);
    const messagesChanged = newMessagesKey !== messagesKey;

    if (messagesChanged || !hasInitialized) {
      setMessagesKey(newMessagesKey);
      setCurrentMessages(messages);

      setHasInitialized(true);

      setDisplayedMessages([]);
      setMessageStates({});

      setIsAnimating(false);
      setIsTyping(false);
    }
  }, [messages, messagesKey, hasInitialized]);

  useEffect(() => {
    if (
      currentMessages.length === 0 ||
      displayedMessages.length >= currentMessages.length
    ) {
      return;
    }

    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    let isCancelled = false;
    const activeTimers = new Set<number>();

    const sleep = (ms: number) =>
      new Promise<void>(resolve => {
        const id = window.setTimeout(() => {
          activeTimers.delete(id);
          resolve();
        }, ms);
        activeTimers.add(id);
      });

    const play = async (index: number) => {
      if (isCancelled || index >= currentMessages.length) return;

      const current = currentMessages[index];

      if (current.role === 'assistant') {
        const newIndex = displayedMessages.length;

        setDisplayedMessages(prev => [...prev, current]);
        setMessageStates(prev => ({ ...prev, [newIndex]: 'typing' }));

        setIsTyping(true);

        await sleep(current.content.length * 50);

        if (isCancelled) return;

        setMessageStates(prev => ({
          ...prev,
          [newIndex]: 'completed',
        }));
        setIsTyping(false);

        return play(index + 1);
      }

      await sleep(150);

      if (isCancelled) return;

      setDisplayedMessages(prev => [...prev, current]);

      await sleep(current.content.length * 30);

      if (isCancelled) return;
      return play(index + 1);
    };

    void play(displayedMessages.length).finally(() => {
      setIsAnimating(false);
    });

    const safetyTimeout = setTimeout(() => {
      if (!isCancelled) setIsAnimating(false);
    }, 30000);

    return () => {
      isCancelled = true;
      setIsAnimating(false);
      clearTimeout(safetyTimeout);

      activeTimers.forEach(id => clearTimeout(id));
      activeTimers.clear();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessages]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isAtBottom) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [displayedMessages.length, isTyping, isAtBottom]);

  return (
    <div
      className={cn(
        'bg-card [--card-radius:1rem] [--card-padding:0.25rem] p-(--card-padding) rounded-(--card-radius) group w-full overflow-hidden',
        className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative rounded-[calc(var(--card-radius)-var(--card-padding))] h-full flex flex-col bg-border/40 group w-full overflow-hidden transition-all duration-150 ease-in-out min-h-full',
          styles.container,
        )}
      >
        {theme === 'whatsapp' && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/chat-themes/whatsapp-doodles.png"
              alt=""
              width={800}
              height={800}
              fetchPriority="high"
              className="size-full object-cover opacity-[0.25] dark:opacity-[0.07]"
            />
          </div>
        )}

        <header
          className={cn(
            'flex items-center justify-between z-1 transition-all duration-100 p-4',
            styles.header,
          )}
        >
          <div className="flex items-center gap-2 w-full">
            <OnnebookLogo
              variant="icon"
              classNames={{ icon: { container: 'size-5' } }}
            />

            <p className={cn('text-sm font-medium', styles.title)}>
              {'headerTitle'}
            </p>
          </div>
        </header>

        <ul
          ref={scrollRef}
          tabIndex={-1}
          className={cn(
            'flex flex-col flex-1 gap-4 overflow-y-auto overflow-x-hidden px-4 transition-all duration-100 min-h-110 sm:max-h-110 list-none m-0',
            !disabled && styles.messagesArea,
          )}
          onScroll={handleScroll}
        >
          {disabled ? (
            <div className="relative flex-1 items-center justify-center h-full">
              <div className="flex flex-col gap-4 mask-b-from-50 opacity-15 dark:opacity-25">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-2 w-full max-w-3/4 min-h-8 h-12 rounded-2xl',
                      i % 2 === 0
                        ? 'ml-auto flex-row-reverse bg-foreground/20 dark:bg-foreground/15 rounded-tr-sm'
                        : 'justify-start bg-foreground/5 dark:bg-foreground/25 rounded-tl-sm',
                    )}
                    style={{
                      animationDelay: `${i * 100}ms`,
                      minHeight: `${32 * i}px`,
                    }}
                  />
                ))}
              </div>

              <div className="text-base w-full text-center text-foreground absolute left-1/2 -translate-x-1/2 bottom-1/2 -translate-y-1/2">
                <TextShimmer className="[--base-color:var(--color-muted-foreground)] [--base-gradient-color:var(--color-foreground)]">
                  {'comingSoon'}
                </TextShimmer>
              </div>
            </div>
          ) : (
            [
              ...(theme === 'messenger' || theme === 'instagram'
                ? [
                    {
                      role: 'space',
                      content: ' ',
                    },
                  ]
                : []),
              ...displayedMessages,
              ...(theme === 'messenger' || theme === 'instagram'
                ? [
                    {
                      role: 'space',
                      content: ' ',
                    },
                  ]
                : []),
            ].map((message, index) => {
              const isUser = message.role === 'user';
              const isAssistant = message.role === 'assistant';

              const isSpace = message.role === 'space';

              const previousMessage = displayedMessages[index - 1];
              const hasSameRoleAsPrevious =
                previousMessage && previousMessage.role === message.role;

              return (
                <li
                  key={`${index}-${message.content}`}
                  className={cn(
                    'flex flex-col rounded-2xl p-3 leading-relaxed whitespace-pre-wrap wrap-break-word max-w-3/4 transition-all duration-300 ease-out animate-in slide-in-from-bottom-2 fade-in-0 first:mt-3! last:mb-3! text-sm',
                    hasSameRoleAsPrevious && '-mt-2!',
                    isAssistant &&
                      'rounded-tr-xs ml-auto text-right text-pretty slide-in-from-right-2',
                    isUser && 'rounded-tl-xs mr-auto slide-in-from-left-2',
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleAssistant,
                    isSpace && 'hidden',
                  )}
                  style={{
                    animationDuration: '400ms',
                    animationFillMode: 'both',
                  }}
                >
                  <div
                    className={cn(
                      'flex gap-1.5 mb-1',
                      isAssistant && 'ml-auto',
                    )}
                  >
                    <span className="text-xs opacity-50">
                      {isUser
                        ? 'labels.yourCustomer'
                        : 'labels.aiAgent'}
                    </span>

                    {isAssistant && (
                      <OnnebookLogo
                        variant="icon"
                        classNames={{
                          icon: { container: 'size-4 mb-1 -scale-x-100' },
                        }}
                      />
                    )}
                  </div>

                  {isAssistant && messageStates[index] === 'typing' ? (
                    <div className="inline-flex items-center gap-1 py-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="size-2 rounded-full bg-current animate-bounce"
                          style={{
                            animationDelay: `${i * 150}ms`,
                            animationDuration: '1s',
                            animationIterationCount: 'infinite',
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="animate-in fade-in-0 duration-300 text-sm text-pretty">
                      {message.content}
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
