import { apiClient } from "@/lib/apiClient";
import type { MiscResponse, MiscUpdate } from "@/types/api";

export const miscService = {
  get: () => apiClient.get<MiscResponse>("/api/misc"),
  update: (body: MiscUpdate) => apiClient.patch<MiscResponse>("/api/misc", body),
};
