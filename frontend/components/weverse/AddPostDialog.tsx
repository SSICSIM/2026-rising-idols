"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { useCreatePost } from "@/hooks/usePosts";
import { toDirectImageUrl } from "@/lib/photoUrl";
import type { PostResponse } from "@/types/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When set, the new post is filed as a reply to this post.
  replyTo?: PostResponse | null;
}

const EMPTY = { user_name: "", min_ago: "", message: "", likes: "", image: "" };

export function AddPostDialog({ open, onOpenChange, replyTo }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [isArtist, setIsArtist] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { mutate, isPending } = useCreatePost();

  function set(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function close() {
    setForm(EMPTY);
    setIsArtist(false);
    setShowImage(false);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.user_name.trim() || !form.message.trim() || form.min_ago === "") return;
    mutate(
      {
        user_name: form.user_name.trim(),
        min_ago: Number(form.min_ago),
        message: form.message.trim(),
        likes: form.likes === "" ? 0 : Number(form.likes),
        reply_to_id: replyTo?.id ?? null,
        is_artist: isArtist,
        image: form.image.trim() ? toDirectImageUrl(form.image) : null,
      },
      { onSuccess: close },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{replyTo ? `Reply to ${replyTo.user_name}` : "New Post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="post-user">User Name</Label>
            <Input id="post-user" value={form.user_name} onChange={(e) => set("user_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-min-ago">Time Ago (minutes)</Label>
            <Input
              id="post-min-ago"
              type="number"
              min={0}
              value={form.min_ago}
              onChange={(e) => set("min_ago", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-message">Message</Label>
            <Input id="post-message" value={form.message} onChange={(e) => set("message", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-likes">Number of Likes</Label>
            <Input
              id="post-likes"
              type="number"
              min={0}
              value={form.likes}
              onChange={(e) => set("likes", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImage((s) => !s)}
              className="border-[#D99A0B] text-[#B98208]"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
            {showImage && (
              <div className="space-y-1.5">
                <Label htmlFor="post-image">Google Drive or image link</Label>
                <Input
                  id="post-image"
                  placeholder="https://drive.google.com/file/d/…"
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Set the file to &ldquo;Anyone with the link&rdquo; in Drive so it can display.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="post-is-artist" checked={isArtist} onCheckedChange={(v) => setIsArtist(v === true)} />
            <Label htmlFor="post-is-artist">Posted by an artist</Label>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !form.user_name.trim() || !form.message.trim() || form.min_ago === ""}
            >
              {isPending ? "Posting…" : replyTo ? "Add Reply" : "Add Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
