"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { moderatePost } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

type Post = {
  id: string;
  author: string;
  text: string;
  tag: string;
  hearts: number;
  createdAt: string;
};

const TAGS = ["deepfake", "morphed image", "harassment", "sextortion", "account hacking"];

function randomAuthor() {
  const birds = ["Brave Sparrow", "Calm Heron", "Quiet Lark"];
  const cities = ["Mumbai", "Delhi", "Chennai", "Bengaluru"];
  return `${birds[Math.floor(Math.random() * birds.length)]} from ${cities[Math.floor(Math.random() * cities.length)]}`;
}

export default function CommunityPage() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [tag, setTag] = useState(TAGS[0]);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("deepshield_community");
    if (raw) setPosts(JSON.parse(raw) as Post[]);
  }, []);

  function save(next: Post[]) {
    setPosts(next);
    localStorage.setItem("deepshield_community", JSON.stringify(next));
  }

  async function publish() {
    if (!text.trim() || text.length > 300) return;
    setPosting(true);
    setError(null);
    try {
      const mod = await moderatePost({ text, language });
      if (!mod.allowed) {
        setError(mod.reason || "Post not allowed");
        return;
      }
      const post: Post = {
        id: crypto.randomUUID(),
        author: randomAuthor(),
        text: text.trim(),
        tag,
        hearts: 0,
        createdAt: new Date().toISOString(),
      };
      save([post, ...posts]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Community shield</h1>
      <p className="mb-8 text-espresso/70">Anonymous stories — stored only on your device.</p>
      <GlassCard className="mb-8 space-y-3">
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-sage/40 bg-fantasy px-3 py-2 text-sm"
        >
          {TAGS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 300))}
          rows={3}
          placeholder="Share advice or solidarity (max 300 chars)…"
          className="w-full rounded-xl border border-sage/40 bg-fantasy p-3 text-sm"
        />
        <button
          type="button"
          onClick={publish}
          disabled={posting}
          className="rounded-full bg-rose px-5 py-2 text-sm font-medium text-espresso"
        >
          {posting ? "Checking…" : "Post anonymously"}
        </button>
        {error && <p className="text-sm text-rose">{error}</p>}
      </GlassCard>
      <div className="space-y-4">
        {posts.map((p) => (
          <GlassCard key={p.id}>
            <p className="text-xs text-espresso/60">
              {p.author} · {p.tag}
            </p>
            <p className="mt-2 text-sm">{p.text}</p>
            <button
              type="button"
              onClick={() =>
                save(
                  posts.map((x) =>
                    x.id === p.id ? { ...x, hearts: x.hearts + 1 } : x,
                  ),
                )
              }
              className="mt-3 text-sm text-rose"
            >
              ♥ {p.hearts}
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
