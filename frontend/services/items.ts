import { apiClient } from "@/lib/apiClient";
import type { ItemCreate, ItemResponse } from "@/types/api";

export const itemsService = {
  list: (periodId?: number) =>
    apiClient.get<ItemResponse[]>(periodId === undefined ? "/api/items" : `/api/items?period_id=${periodId}`),
  create: (body: ItemCreate) => apiClient.post<ItemResponse>("/api/items", body),
  delete: (id: number) => apiClient.delete<void>(`/api/items/${id}`),
};
