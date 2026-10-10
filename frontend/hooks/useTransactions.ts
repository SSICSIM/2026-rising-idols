"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { transactionsService } from "@/services/transactions";
import type { TransactionCreate, TransactionUpdate } from "@/types/api";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsService.list(),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TransactionCreate) => transactionsService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      // Creating a transaction moves the net worth total on the backend.
      qc.invalidateQueries({ queryKey: ["misc"] });
      toast.success("Transaction added.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to add transaction."),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: TransactionUpdate }) =>
      transactionsService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update transaction."),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transactionsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete transaction."),
  });
}
