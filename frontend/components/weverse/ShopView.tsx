"use client";

import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
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
import { toDirectImageUrl } from "@/lib/photoUrl";
import { useAddButtons } from "@/components/AddButtonsContext";
import { useActivePeriod } from "@/hooks/useCrisisPeriods";
import { useShowPreviousPeriods } from "@/components/ShowPreviousPeriodsContext";
import { useCreateItem, useDeleteItem, useItems } from "@/hooks/useItems";
import { WeverseLayout } from "./WeverseLayout";

const EMPTY = { title: "", cost: "", photo: "" };

function AddItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState(EMPTY);
  const [showPhoto, setShowPhoto] = useState(false);
  const { mutate, isPending } = useCreateItem();

  function set(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function close() {
    setForm(EMPTY);
    setShowPhoto(false);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || form.cost === "") return;
    mutate(
      {
        title: form.title.trim(),
        cost: Number(form.cost),
        photo: form.photo.trim() ? toDirectImageUrl(form.photo) : null,
      },
      { onSuccess: close },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Shop Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="item-title">Item Title</Label>
            <Input id="item-title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="item-cost">Cost</Label>
            <Input
              id="item-cost"
              type="number"
              min={0}
              value={form.cost}
              onChange={(e) => set("cost", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPhoto((s) => !s)}
              className="border-[#D99A0B] text-[#B98208]"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
            {showPhoto && (
              <div className="space-y-1.5">
                <Label htmlFor="item-photo">Google Drive or image link</Label>
                <Input
                  id="item-photo"
                  placeholder="https://drive.google.com/file/d/…"
                  value={form.photo}
                  onChange={(e) => set("photo", e.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Set the file to &ldquo;Anyone with the link&rdquo; in Drive so it can display.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !form.title.trim() || form.cost === ""}>
              {isPending ? "Adding…" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ShopView() {
  const [addOpen, setAddOpen] = useState(false);
  const { showAddButtons } = useAddButtons();
  const { data: activePeriod } = useActivePeriod();
  const { showPreviousPeriods } = useShowPreviousPeriods();
  const { data: items = [], isLoading } = useItems(showPreviousPeriods ? undefined : (activePeriod?.id ?? null));
  const { mutate: removeItem } = useDeleteItem();

  return (
    <WeverseLayout>
      <div className="flex justify-center">
        {showAddButtons && (
          <Button
            className="bg-[#D99A0B] text-white hover:bg-[#B98208]"
            onClick={() => setAddOpen(true)}
            disabled={!activePeriod}
          >
            Add Item
          </Button>
        )}
      </div>

      {!activePeriod && (
        <p className="text-muted-foreground text-center text-sm">
          No active period. Create one from the Crisis Tracker before adding items.
        </p>
      )}

      {isLoading && <p className="text-muted-foreground py-8 text-center text-sm">Loading…</p>}
      {!isLoading && activePeriod && items.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">No items yet.</p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="bg-muted group relative rounded-md p-2">
            {showAddButtons && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 h-7 w-7 opacity-0 group-hover:opacity-100"
                aria-label="Delete item"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#E8714F]">
              {item.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.photo} alt={item.title} className="h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-2 text-xs font-bold">{item.title}</p>
            <p className="text-muted-foreground text-xs tabular-nums">${item.cost}</p>
          </div>
        ))}
      </div>

      <AddItemDialog open={addOpen} onOpenChange={setAddOpen} />
    </WeverseLayout>
  );
}
