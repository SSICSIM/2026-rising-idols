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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
}

export function SettingsDialog({ open, onOpenChange, total }: Props) {
  const [value, setValue] = useState("");
  const { mutate, isPending } = useUpdateMisc();

  // Load the current total each time the dialog opens.
  useEffect(() => {
    if (open) setValue(String(total));
  }, [open, total]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = Number(value);
    if (value.trim() === "" || Number.isNaN(next)) return;
    // The starting amount sets both the current and previous-period totals,
    // so the first comparison starts from the same baseline.
    mutate(
      {
        total: next,
        total_at_end_of_prev_period: next,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="set-total">Initial total</Label>
            <Input
              id="set-total"
              type="number"
              inputMode="decimal"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending || value.trim() === ""}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
