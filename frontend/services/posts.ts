import { apiClient } from "@/lib/apiClient";
import type { PostCreate, PostResponse } from "@/types/api";

export const postsService = {
  list: (periodId?: number) =>
    apiClient.get<PostResponse[]>(periodId === undefined ? "/api/posts" : `/api/posts?period_id=${periodId}`),
  create: (body: PostCreate) => apiClient.post<PostResponse>("/api/posts", body),
  delete: (id: number) => apiClient.delete<void>(`/api/posts/${id}`),
};
