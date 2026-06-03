"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { moderatePost } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

type Post = {
  id: string;
  author: string;
  text: string;
  tag: string;
  hearts: number;
  createdAt: string;
};

const TAG_KEYS: I18nKey[] = [
  "communityTagDeepfake",
  "communityTagMorphed",
  "communityTagHarassment",
  "communityTagSextortion",
  "communityTagHacking",
];

const AUTHOR_KEYS: I18nKey[] = [
  "communityAuthor1",
  "communityAuthor2",
  "communityAuthor3",
];

export default function CommunityPage() {
  const { apiLanguage, t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [tagKey, setTagKey] = useState<I18nKey>(TAG_KEYS[0]);
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

  function randomAuthor() {
    return t(AUTHOR_KEYS[Math.floor(Math.random() * AUTHOR_KEYS.length)]);
  }

  async function publish() {
    if (!text.trim() || text.length > 300) return;
    setPosting(true);
    setError(null);
    try {
      const mod = await moderatePost({ text, language: apiLanguage });
      if (!mod.allowed) {
        setError(mod.reason || t("communityPostNotAllowed"));
        return;
      }
      const post: Post = {
        id: crypto.randomUUID(),
        author: randomAuthor(),
        text: text.trim(),
        tag: t(tagKey),
        hearts: 0,
        createdAt: new Date().toISOString(),
      };
      save([post, ...posts]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("communityPostFailed"));
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
          value={tagKey}
          onChange={(e) => setTagKey(e.target.value as I18nKey)}
          className="input-field"
        >
          {TAG_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(key)}
            </option>
          ))}
        </select>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 300))}
          rows={3}
          placeholder={t("communityPlaceholder")}
          className="input-field"
        />
        <p className="text-right text-xs text-ink-subtle">{text.length}/300</p>
        <Button variant="primary" onClick={publish} disabled={posting} className="w-full">
          {posting ? t("communityChecking") : t("communityPost")}
        </Button>
        {error && <p className="text-sm text-danger">{error}</p>}
      </GlassCard>

      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-center text-sm text-ink-subtle">{t("communityEmpty")}</p>
        )}
        {posts.map((p) => (
          <GlassCard key={p.id}>
            <p className="text-xs font-medium text-accent">{p.author}</p>
            <span className="mt-1 inline-block rounded-full bg-peach/50 px-2 py-0.5 text-xs text-ink-muted">
              {p.tag}
            </span>
            <p className="mt-3 text-sm leading-relaxed">{p.text}</p>
            <button
              type="button"
              onClick={() =>
                save(posts.map((x) => (x.id === p.id ? { ...x, hearts: x.hearts + 1 } : x)))
              }
              className="mt-4 text-sm font-medium text-accent transition hover:text-ink"
            >
              ♥ {p.hearts}
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
