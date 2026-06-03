"use client";

import { useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { streamAshaChat } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import type { ChatMessage } from "@/lib/types";

const CRISIS = [
  "Cyber Crime Helpline: 1930",
  "NCW Helpline: 181",
  "iCall: 9152987821",
];

export function AshaChat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I'm Asha. I'm here to listen and help you take the next step — you're not alone.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
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

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-4">
      <GlassCard className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-rose/40 text-espresso"
                  : "bg-white/50 text-espresso"
              }`}
            >
              {m.content}
              {streaming && i === messages.length - 1 && m.role === "assistant" && (
                <span className="ml-1 inline-block animate-pulse">▍</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-white/30 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Share what's happening…"
              className="flex-1 rounded-full border border-sage/40 bg-fantasy px-4 py-2 text-sm outline-none focus:border-rose"
            />
            <button
              type="button"
              onClick={send}
              disabled={streaming}
              className="rounded-full bg-espresso px-5 py-2 text-sm text-fantasy disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="mb-2 text-sm font-medium text-espresso">I need immediate help</p>
        <ul className="text-sm text-espresso/80">
          {CRISIS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
