"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { miscService } from "@/services/misc";
import type { MiscUpdate } from "@/types/api";

export function useMisc() {
  return useQuery({
    queryKey: ["misc"],
    queryFn: () => miscService.get(),
  });
}

export function useUpdateMisc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MiscUpdate) => miscService.update(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["misc"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update."),
  });
}
