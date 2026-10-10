"use client";

import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMisc } from "@/hooks/useMisc";
import { useCreateNotice, useDeleteNotice, useNotices } from "@/hooks/useNotices";
import { useAddButtons } from "@/components/AddButtonsContext";
import { useActivePeriod } from "@/hooks/useCrisisPeriods";
import { useShowPreviousPeriods } from "@/components/ShowPreviousPeriodsContext";
import { WeverseLayout } from "./WeverseLayout";

const EMPTY = { min_ago: "", message: "", likes: "" };

function AddNoticeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState(EMPTY);
  const { mutate, isPending } = useCreateNotice();

  function set(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function close() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim() || form.min_ago === "") return;
    mutate(
      {
        min_ago: Number(form.min_ago),
        message: form.message.trim(),
        likes: form.likes === "" ? 0 : Number(form.likes),
      },
      { onSuccess: close },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Notice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="notice-min-ago">Time Ago (minutes)</Label>
            <Input
              id="notice-min-ago"
              type="number"
              min={0}
              value={form.min_ago}
              onChange={(e) => set("min_ago", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notice-message">Message</Label>
            <Input id="notice-message" value={form.message} onChange={(e) => set("message", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notice-likes">Number of Likes</Label>
            <Input
              id="notice-likes"
              type="number"
              min={0}
              value={form.likes}
              onChange={(e) => set("likes", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !form.message.trim() || form.min_ago === ""}>
              {isPending ? "Posting…" : "Add Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NoticesView() {
  const [addOpen, setAddOpen] = useState(false);
  const { showAddButtons } = useAddButtons();
  const { data: activePeriod } = useActivePeriod();
  const { showPreviousPeriods } = useShowPreviousPeriods();
  const { data: misc } = useMisc();
  const { data: notices = [], isLoading } = useNotices(showPreviousPeriods ? undefined : (activePeriod?.id ?? null));
  const { mutate: removeNotice } = useDeleteNotice();

  const groupName = misc?.group_name || "Group Name";

  return (
    <WeverseLayout>
      <div className="flex justify-center">
        {showAddButtons && (
          <Button
            className="bg-[#D99A0B] text-white hover:bg-[#B98208]"
            onClick={() => setAddOpen(true)}
            disabled={!activePeriod}
          >
            Add Notice
          </Button>
        )}
      </div>

      {!activePeriod && (
        <p className="text-muted-foreground text-center text-sm">
          No active period. Create one from the Crisis Tracker before adding notices.
        </p>
      )}

      <div className="mx-auto max-w-xl space-y-4">
        {isLoading && <p className="text-muted-foreground py-8 text-center text-sm">Loading…</p>}
        {!isLoading && notices.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">No notices yet.</p>
        )}
        {notices.map((n) => (
          <div key={n.id} className="bg-muted rounded-md p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase">{groupName} News</p>
                <p className="text-muted-foreground text-[10px]">{n.min_ago} min ago</p>
              </div>
              {showAddButtons && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Delete notice"
                  onClick={() => removeNotice(n.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap">{n.message}</p>
            <p className="text-muted-foreground mt-3 flex items-center gap-1 text-xs tabular-nums">
              <Heart className="h-3 w-3" /> {n.likes.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <AddNoticeDialog open={addOpen} onOpenChange={setAddOpen} />
    </WeverseLayout>
  );
}
