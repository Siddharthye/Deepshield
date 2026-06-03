"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { streamAshaChat } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { RIGHTS_PROMPT_KEYS } from "@/components/asha/BasicRights";
import type { ChatMessage } from "@/lib/types";
import type { I18nKey } from "@/lib/i18n";

const SESSION_KEY = "deepshield-asha-messages";

const CRISIS_KEYS: I18nKey[] = ["ashaCrisis1", "ashaCrisis2", "ashaCrisis3"];

export function AshaChat({
  onQuickPrompt,
}: {
  onQuickPrompt?: (q: string) => void;
}) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome = t("ashaWelcome");
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) {
        setMessages([{ role: "assistant", content: welcome }]);
        return;
      }
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        if (first.role === "assistant") {
          setMessages([{ role: "assistant", content: welcome }, ...parsed.slice(1)]);
        } else {
          setMessages(parsed);
        }
      } else {
        setMessages([{ role: "assistant", content: welcome }]);
      }
    } catch {
      setMessages([{ role: "assistant", content: welcome }]);
    }
  }, [language, t]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    let assistantText = "";
    setMessages([...next, { role: "assistant", content: "" }]);

    await streamAshaChat({
      messages: next,
      language,
      onToken: (tok) => {
        assistantText += tok;
        setMessages([...next, { role: "assistant", content: assistantText }]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      onError: (msg) => {
        setMessages([
          ...next,
          {
            role: "assistant",
            content: t("ashaConnectionError").replace("{msg}", msg),
          },
        ]);
      },
      onDone: () => setStreaming(false),
    });
    setStreaming(false);
  }

  function handleQuick(key: I18nKey) {
    const q = t(key);
    onQuickPrompt?.(q);
    void send(q);
  }

  return (
    <div className="flex h-full min-h-[min(72vh,720px)] flex-col gap-4">
      <GlassCard className="flex h-full flex-col overflow-hidden p-0">
        <div className="flex items-center gap-4 border-b border-white/30 bg-peach/30 px-6 py-4">
          <Image
            src="/images/asha-logo.jpeg"
            alt={t("ashaCompanionAlt")}
            width={56}
            height={56}
            className="rounded-full object-cover"
            unoptimized
          />
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{t("ashaChatTitle")}</h2>
            <p className="text-xs text-ink-muted">{t("ashaChatSubtitle")}</p>
          </div>
        </div>

        <div className="border-b border-white/20 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-ink-muted">{t("ashaQuickRights")}</p>
          <div className="flex flex-wrap gap-2">
            {RIGHTS_PROMPT_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleQuick(key)}
                disabled={streaming}
                className="rounded-full bg-peach/80 px-3 py-1.5 text-xs text-ink transition hover:bg-pink/50 disabled:opacity-50"
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-6">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-pink/40 text-ink"
                    : "bg-cream/90 text-ink shadow-sm"
                }`}
              >
                {m.content}
                {streaming &&
                  i === messages.length - 1 &&
                  m.role === "assistant" &&
                  !m.content && (
                    <span className="flex items-center gap-1 py-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="inline-block h-2 w-2 rounded-full bg-pink"
                          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: d * 0.12,
                          }}
                        />
                      ))}
                      <span className="ml-2 text-xs text-ink-subtle">{t("ashaThinking")}</span>
                    </span>
                  )}
                {streaming &&
                  i === messages.length - 1 &&
                  m.role === "assistant" &&
                  m.content && (
                    <span className="ml-1 inline-block animate-pulse text-accent">▍</span>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/30 bg-cream/50 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={t("ashaPlaceholder")}
              className="input-field flex-1 rounded-full"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={streaming}
              className="rounded-full bg-gradient-to-r from-pink to-peach px-5 py-2.5 text-sm font-medium text-ink shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              {t("ashaSend")}
            </button>
          </div>
        </div>
      </GlassCard>

      <div>
        <button
          type="button"
          onClick={() => setCrisisOpen((o) => !o)}
          className="w-full rounded-full border border-pink/50 bg-gradient-to-r from-pink/40 to-peach/50 px-5 py-3 text-sm font-semibold text-ink transition hover:from-pink/55 hover:to-peach/60"
        >
          {t("ashaImmediateHelp")}
        </button>
        {crisisOpen && (
          <GlassCard className="mt-3 border-pink/30 bg-peach/20">
            <ul className="space-y-1 text-sm text-ink-muted">
              {CRISIS_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
