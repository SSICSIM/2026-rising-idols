"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { itemsService } from "@/services/items";
import type { ItemCreate } from "@/types/api";

// undefined = every period; null = no active period, so nothing is fetched.
export function useItems(periodId: number | null | undefined) {
  return useQuery({
    queryKey: ["items", periodId ?? "all"],
    queryFn: () => itemsService.list(periodId ?? undefined),
    enabled: periodId !== null,
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ItemCreate) => itemsService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item added.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to add item."),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => itemsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete item."),
  });
}
