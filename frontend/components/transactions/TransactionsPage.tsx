"use client";

import { useMemo, useState } from "react";
import { Search, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddButtons } from "@/components/AddButtonsContext";
import { useActivePeriod } from "@/hooks/useCrisisPeriods";
import { useCharacters } from "@/hooks/useCharacters";
import { useDeleteTransaction, useTransactions } from "@/hooks/useTransactions";
import { useMisc } from "@/hooks/useMisc";
import type { TransactionResponse } from "@/types/api";
import { cn } from "@/lib/utils";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { SettingsDialog } from "./SettingsDialog";

const ALL = "all";

function formatDelta(delta: number) {
  const text = Number(delta.toFixed(2)).toString();
  if (delta > 0) return `+${text}`;
  if (delta < 0) return text;
  return "0";
}

export function TransactionsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { showAddButtons } = useAddButtons();
  const [search, setSearch] = useState("");
  const [delegateFilter, setDelegateFilter] = useState(ALL);

  const { data: activePeriod } = useActivePeriod();
  const { data: misc } = useMisc();
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: characters = [] } = useCharacters();
  const { mutate: removeTransaction } = useDeleteTransaction();

  const nameById = useMemo(() => new Map(characters.map((c) => [c.id, c.name])), [characters]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (delegateFilter !== ALL && !t.delegates.includes(Number(delegateFilter))) return false;
      if (!q) return true;
      const delegateNames = t.delegates.map((id) => nameById.get(id) ?? "").join(" ");
      return `${t.transaction_name} ${delegateNames}`.toLowerCase().includes(q);
    });
  }, [transactions, search, delegateFilter, nameById]);

  const total = misc?.total ?? 0;
  const prevTotal = misc?.total_at_end_of_prev_period ?? 0;
  const diff = total - prevTotal;
  const diffPct = prevTotal === 0 ? 0 : (diff / prevTotal) * 100;
  const diffTone = diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <main className="page-shell space-y-6">
      <section className="space-y-2 pt-6 text-center">
        <p className="text-6xl font-black tracking-tight tabular-nums sm:text-7xl">
          ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <p className={cn("text-3xl font-semibold tabular-nums", diffTone)}>
          {diff > 0 ? "+" : ""}
          {diff.toLocaleString(undefined, { maximumFractionDigits: 2 })} | {diffPct > 0 ? "+" : ""}
          {diffPct.toFixed(1)}%
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={delegateFilter} onValueChange={setDelegateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Delegate name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All delegates</SelectItem>
            {characters.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              className="w-56 pl-8"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {showAddButtons && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {showAddButtons && (
            <Button
              className="bg-[#D99A0B] text-white hover:bg-[#B98208]"
              onClick={() => setAddOpen(true)}
              disabled={!activePeriod}
            >
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {!activePeriod && (
        <p className="text-muted-foreground text-sm">
          No active period. Create one from the Crisis Tracker before adding transactions.
        </p>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Delegate(s)</TableHead>
              <TableHead className="text-right">Difference</TableHead>
              {showAddButtons && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
            {rows.map((t: TransactionResponse) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.transaction_name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {t.delegates.map((id) => nameById.get(id) ?? `#${id}`).join(", ")}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    t.delta > 0 && "text-emerald-600",
                    t.delta < 0 && "text-red-600",
                    t.delta === 0 && "text-muted-foreground",
                  )}
                >
                  {formatDelta(t.delta)}
                </TableCell>
                {showAddButtons && (
                  <TableCell className="w-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete transaction"
                      onClick={() => removeTransaction(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddTransactionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        total={total}
      />
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        total={total}
      />
    </main>
  );
}
