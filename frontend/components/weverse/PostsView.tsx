"use client";

import { useMemo, useState } from "react";
import { Heart, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddButtons } from "@/components/AddButtonsContext";
import { cn } from "@/lib/utils";
import { useActivePeriod } from "@/hooks/useCrisisPeriods";
import { useShowPreviousPeriods } from "@/components/ShowPreviousPeriodsContext";
import { useDeletePost, usePosts } from "@/hooks/usePosts";
import type { PostResponse } from "@/types/api";
import { AddPostDialog } from "./AddPostDialog";
import { WeverseLayout } from "./WeverseLayout";

function PostCard({
  post,
  onReply,
  onDelete,
  nested = false,
}: {
  post: PostResponse;
  onReply?: () => void;
  onDelete: () => void;
  nested?: boolean;
}) {
  const { showAddButtons } = useAddButtons();
  return (
    <div
      className={cn(
        "rounded-md p-3",
        nested && "ml-12",
        post.is_artist
          ? "bg-[#D99A0B]/20 ring-1 ring-[#D99A0B]/50"
          : nested ? "bg-muted/60" : "bg-muted",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-bold">
            {post.user_name}
            {post.is_artist && <span className="ml-1.5 text-[10px] font-semibold text-[#B98208]">ARTIST</span>}
          </p>
          <p className="text-muted-foreground text-[10px]">{post.min_ago} min ago</p>
        </div>
        {showAddButtons && (
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Delete post" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <p className="mt-3 text-sm whitespace-pre-wrap">{post.message}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
          <Heart className="h-3 w-3" /> {post.likes.toLocaleString()}
        </p>
        {onReply && showAddButtons && (
          <Button size="sm" className="bg-[#D99A0B] text-white hover:bg-[#B98208]" onClick={onReply}>
            Add Reply
          </Button>
        )}
      </div>
    </div>
  );
}

export function PostsView() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<PostResponse | null>(null);

  const { showAddButtons } = useAddButtons();
  const { data: activePeriod } = useActivePeriod();
  const { showPreviousPeriods } = useShowPreviousPeriods();
  const { data: posts = [], isLoading } = usePosts(showPreviousPeriods ? undefined : (activePeriod?.id ?? null));
  const { mutate: removePost } = useDeletePost();

  // Top-level posts, most recent first, each followed by its replies.
  const threads = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = (p: PostResponse) =>
      !q || `${p.user_name} ${p.message}`.toLowerCase().includes(q);
    const replies = new Map<number, PostResponse[]>();
    for (const p of posts) {
      if (p.reply_to_id != null) {
        replies.set(p.reply_to_id, [...(replies.get(p.reply_to_id) ?? []), p]);
      }
    }
    // min_ago counts minutes since posting, so the smallest value is the most recent.
    const byRecency = (a: PostResponse, b: PostResponse) => a.min_ago - b.min_ago;
    return posts
      .filter((p) => p.reply_to_id == null)
      .filter((p) => matches(p) || (replies.get(p.id) ?? []).some(matches))
      .sort(byRecency)
      .map((p) => ({ post: p, replies: [...(replies.get(p.id) ?? [])].sort(byRecency) }));
  }, [posts, search]);

  function openAdd(target: PostResponse | null) {
    setReplyTo(target);
    setAddOpen(true);
  }

  return (
    <WeverseLayout>
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            className="w-64 pl-8"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {showAddButtons && (
          <Button
            className="bg-[#D99A0B] text-white hover:bg-[#B98208]"
            onClick={() => openAdd(null)}
            disabled={!activePeriod}
          >
            Add Post
          </Button>
        )}
      </div>

      {!activePeriod && (
        <p className="text-muted-foreground text-sm">
          No active period. Create one from the Crisis Tracker before adding posts.
        </p>
      )}

      <div className="mx-auto max-w-xl space-y-4">
        {isLoading && <p className="text-muted-foreground py-8 text-center text-sm">Loading…</p>}
        {!isLoading && threads.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">No posts yet.</p>
        )}
        {threads.map(({ post, replies }) => (
          <div key={post.id} className="space-y-2">
            <PostCard
              post={post}
              onReply={() => openAdd(post)}
              onDelete={() => removePost(post.id)}
            />
            {replies.map((r) => (
              <PostCard key={r.id} post={r} nested onDelete={() => removePost(r.id)} />
            ))}
          </div>
        ))}
      </div>

      <AddPostDialog key={replyTo?.id ?? "new"} open={addOpen} onOpenChange={setAddOpen} replyTo={replyTo} />
    </WeverseLayout>
  );
}
