import { apiClient } from "@/lib/apiClient";
import type { NoticeCreate, NoticeResponse } from "@/types/api";

export const noticesService = {
  list: (periodId?: number) =>
    apiClient.get<NoticeResponse[]>(periodId === undefined ? "/api/notices" : `/api/notices?period_id=${periodId}`),
  create: (body: NoticeCreate) => apiClient.post<NoticeResponse>("/api/notices", body),
  delete: (id: number) => apiClient.delete<void>(`/api/notices/${id}`),
};
