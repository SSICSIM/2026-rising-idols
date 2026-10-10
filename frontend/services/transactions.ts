import { apiClient } from "@/lib/apiClient";
import type { TransactionCreate, TransactionResponse, TransactionUpdate } from "@/types/api";

export const transactionsService = {
  list: () => apiClient.get<TransactionResponse[]>("/api/transaction"),
  create: (body: TransactionCreate) => apiClient.post<TransactionResponse>("/api/transaction", body),
  update: (id: number, body: TransactionUpdate) =>
    apiClient.patch<TransactionResponse>(`/api/transaction/${id}`, body),
  delete: (id: number) => apiClient.delete<void>(`/api/transaction/${id}`),
};
