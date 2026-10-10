"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { postsService } from "@/services/posts";
import type { PostCreate } from "@/types/api";

// undefined = every period; null = no active period, so nothing is fetched.
export function usePosts(periodId: number | null | undefined) {
  return useQuery({
    queryKey: ["posts", periodId ?? "all"],
    queryFn: () => postsService.list(periodId ?? undefined),
    enabled: periodId !== null,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PostCreate) => postsService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post added.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to add post."),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete post."),
  });
}
