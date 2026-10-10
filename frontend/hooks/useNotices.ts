"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { noticesService } from "@/services/notices";
import type { NoticeCreate } from "@/types/api";

// undefined = every period; null = no active period, so nothing is fetched.
export function useNotices(periodId: number | null | undefined) {
  return useQuery({
    queryKey: ["notices", periodId ?? "all"],
    queryFn: () => noticesService.list(periodId ?? undefined),
    enabled: periodId !== null,
  });
}

export function useCreateNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NoticeCreate) => noticesService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice added.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to add notice."),
  });
}

export function useDeleteNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => noticesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice deleted.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete notice."),
  });
}
