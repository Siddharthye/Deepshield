"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { streamAshaChat } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { RIGHTS_QUICK_PROMPTS } from "@/components/asha/BasicRights";
import type { ChatMessage } from "@/lib/types";

const SESSION_KEY = "deepshield-asha-messages";

const CRISIS = [
  "Cyber Crime Helpline: 1930",
  "NCW Helpline: 181",
  "iCall: 9152987821",
];

const WELCOME =
  "I'm Asha — your companion for emotional support and understanding your legal rights. I'm here to listen, validate what you're going through, and help with rights-related questions only. You're not alone.";

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [{ role: "assistant", content: WELCOME }];
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [{ role: "assistant", content: WELCOME }];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : [{ role: "assistant", content: WELCOME }];
  } catch {
    return [{ role: "assistant", content: WELCOME }];
  }
}

export function AshaChat({
  onQuickPrompt,
}: {
  onQuickPrompt?: (q: string) => void;
}) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

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
      onToken: (t) => {
        assistantText += t;
        setMessages([...next, { role: "assistant", content: assistantText }]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      onError: (msg) => {
        setMessages([
          ...next,
          {
            role: "assistant",
            content: `I'm having trouble connecting right now. (${msg}) You can still call 1930 for immediate help.`,
          },
        ]);
      },
      onDone: () => setStreaming(false),
    });
    setStreaming(false);
  }

  function handleQuick(q: string) {
    onQuickPrompt?.(q);
    void send(q);
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="flex flex-col overflow-hidden p-0">
        <div className="flex items-center gap-4 border-b border-white/30 bg-blush/30 px-6 py-4">
          <Image
            src="/images/asha-logo.jpeg"
            alt="Asha"
            width={56}
            height={56}
            className="rounded-full object-cover"
            unoptimized
          />
          <div>
            <h2 className="font-display text-lg font-semibold text-espresso">
              Chat with Asha
            </h2>
            <p className="text-xs text-espresso/70">
              Emotional support & legal rights questions only
            </p>
          </div>
        </div>

        <div className="border-b border-white/20 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-espresso/70">
            Quick rights questions
          </p>
          <div className="flex flex-wrap gap-2">
            {RIGHTS_QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuick(q)}
                disabled={streaming}
                className="rounded-full bg-blush/80 px-3 py-1.5 text-xs text-espresso transition hover:bg-rose/50 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[min(420px,50vh)] flex-1 space-y-3 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-rose/40 text-espresso"
                  : "bg-fantasy/90 text-espresso shadow-sm"
              }`}
            >
              {m.content}
              {streaming &&
                i === messages.length - 1 &&
                m.role === "assistant" &&
                !m.content && (
                  <span className="flex items-center gap-1 py-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="inline-block h-2 w-2 animate-pulse rounded-full bg-rose"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                    <span className="ml-2 text-xs text-espresso/60">
                      Asha is thinking…
                    </span>
                  </span>
                )}
              {streaming &&
                i === messages.length - 1 &&
                m.role === "assistant" &&
                m.content && (
                  <span className="ml-1 inline-block animate-pulse text-rose">
                    ▍
                  </span>
                )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/30 bg-fantasy/50 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Share how you feel, or ask about your rights…"
              className="input-field flex-1 rounded-full"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={streaming}
              className="rounded-full bg-gradient-to-r from-rose to-blush px-5 py-2.5 text-sm font-medium text-espresso shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </GlassCard>

      <div>
        <button
          type="button"
          onClick={() => setCrisisOpen((o) => !o)}
          className="w-full rounded-full border border-rose/50 bg-gradient-to-r from-rose/40 to-blush/50 px-5 py-3 text-sm font-semibold text-espresso transition hover:from-rose/55 hover:to-blush/60"
        >
          I need immediate help
        </button>
        {crisisOpen && (
          <GlassCard className="mt-3 border-rose/30 bg-blush/20">
            <ul className="space-y-1 text-sm text-espresso/85">
              {CRISIS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
