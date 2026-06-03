"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
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
  const { language, t } = useLanguage();
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
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge={t("communityPageBadge")}
        title={t("communityPageTitle")}
        subtitle={t("communityPageSubtitle")}
      />

      <GlassCard className="mb-8 space-y-4">
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="input-field"
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
          className="input-field"
        />
        <p className="text-right text-xs text-ink/50">{text.length}/300</p>
        <Button variant="primary" onClick={publish} disabled={posting} className="w-full">
          {posting ? "Checking…" : "Post anonymously"}
        </Button>
        {error && <p className="text-sm text-pink">{error}</p>}
      </GlassCard>

      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-center text-sm text-ink/60">
            No posts yet. You can be the first voice of support.
          </p>
        )}
        {posts.map((p) => (
          <GlassCard key={p.id}>
            <p className="text-xs font-medium text-pink">{p.author}</p>
            <span className="mt-1 inline-block rounded-full bg-peach/50 px-2 py-0.5 text-xs text-ink/70">
              {p.tag}
            </span>
            <p className="mt-3 text-sm leading-relaxed">{p.text}</p>
            <button
              type="button"
              onClick={() =>
                save(
                  posts.map((x) =>
                    x.id === p.id ? { ...x, hearts: x.hearts + 1 } : x,
                  ),
                )
              }
              className="mt-4 text-sm font-medium text-pink transition hover:text-ink"
            >
              ♥ {p.hearts}
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
