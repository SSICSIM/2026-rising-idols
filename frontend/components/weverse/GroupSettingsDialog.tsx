"use client";

import { useEffect, useState } from "react";
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
import { useUpdateMisc } from "@/hooks/useMisc";
import { toDirectImageUrl } from "@/lib/photoUrl";
import type { MiscResponse } from "@/types/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  misc: MiscResponse | undefined;
}

export function GroupSettingsDialog({ open, onOpenChange, misc }: Props) {
  const [groupName, setGroupName] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const { mutate, isPending } = useUpdateMisc();

  // Load the current values each time the dialog opens.
  useEffect(() => {
    if (open) {
      setGroupName(misc?.group_name ?? "");
      setHeaderImage(misc?.header_image ?? "");
    }
  }, [open, misc]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      {
        group_name: groupName.trim(),
        header_image: headerImage.trim() ? toDirectImageUrl(headerImage) : null,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="group-image">Header image (Google Drive or image link)</Label>
            <Input
              id="group-image"
              placeholder="https://drive.google.com/file/d/…"
              value={headerImage}
              onChange={(e) => setHeaderImage(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Set the file to &ldquo;Anyone with the link&rdquo; in Drive so it can display. Leave empty for the plain banner.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !groupName.trim()}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
