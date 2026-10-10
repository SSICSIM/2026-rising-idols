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
import { Label } from "@/components/ui/label";
import { useCharacters } from "@/hooks/useCharacters";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
}

const PERCENT_STEPS = [-10, -5, 5, 10];

export function AddTransactionDialog({ open, onOpenChange, total }: Props) {
  const [delegates, setDelegates] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [delta, setDelta] = useState("");
  const { data: characters = [] } = useCharacters();
  const { mutate, isPending } = useCreateTransaction();

  function reset() {
    setDelegates([]);
    setName("");
    setDelta("");
  }

  function toggleDelegate(id: number) {
    setDelegates((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }

  // Percent buttons set the manual difference to that percentage of the current total.
  function applyPercent(pct: number) {
    setDelta(String(Math.round(((total * pct) / 100) * 100) / 100));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(delta);
    if (!name.trim() || delegates.length === 0 || delta.trim() === "" || Number.isNaN(value)) return;
    mutate(
      { transaction_name: name.trim(), delegates, delta: value },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Selected delegate(s)</Label>
            <div className="flex flex-wrap gap-1.5">
              {characters.length === 0 && (
                <p className="text-muted-foreground text-xs">Add characters first.</p>
              )}
              {characters.map((c) => {
                const selected = delegates.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleDelegate(c.id)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      selected
                        ? "border-[#D99A0B] bg-[#D99A0B] text-white"
                        : "bg-background hover:bg-muted",
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-name">Name</Label>
            <Input
              id="tx-name"
              placeholder="Transaction name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-delta">Manual Difference</Label>
            <Input
              id="tx-delta"
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="Number here"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
            />
            <div className="flex gap-2 pt-1">
              {PERCENT_STEPS.map((pct) => (
                <Button
                  key={pct}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => applyPercent(pct)}
                >
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !name.trim() || delegates.length === 0 || delta.trim() === ""}
            >
              {isPending ? "Saving…" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
