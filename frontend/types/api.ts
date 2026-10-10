export interface HealthResponse {
  status: string;
}

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type NoteType = "PRIVATE_DIRECTIVE" | "PUBLIC_DIRECTIVE";

// ── Characters ───────────────────────────────────────────────────────────────

export interface CharacterResponse {
  id: number;
  name: string;
  created_at: string;
}

export interface CharacterCreate {
  name: string;
}

export interface BulkUploadResult {
  created: number;
  skipped: number;
}

// ── Crisis Periods ────────────────────────────────────────────────────────────

export interface CrisisPeriodResponse {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  archived_at: string | null;
}

export interface CrisisPeriodCreate {
  name: string;
}

// ── Crisis Notes ──────────────────────────────────────────────────────────────

export interface CrisisNoteResponse {
  id: number;
  period_id: number;
  character: CharacterResponse;
  title: string;
  description: string;
  crisis_staff_notes: string | null;
  priority: Priority;
  note_type: NoteType;
  created_at: string;
}

export interface CrisisNoteCreate {
  character_id: number;
  // The period the client expects the note to land in. The backend rejects
  // the submission (409) if the active period has changed since, instead of
  // silently filing it under a different period than the user saw.
  period_id?: number;
  title: string;
  description: string;
  crisis_staff_notes?: string;
  priority: Priority;
  note_type: NoteType;
}

export interface CrisisNoteUpdate {
  character_id?: number;
  title?: string;
  description?: string;
  crisis_staff_notes?: string | null;
  priority?: Priority;
  note_type?: NoteType;
}

export interface NoteFilters {
  period_id?: number;
  archived_only?: boolean;
  character_id?: number;
  priority?: Priority;
  note_type?: NoteType;
  q?: string;
}

// ── Staff Notes ───────────────────────────────────────────────────────────────

export interface StaffNoteResponse {
  id: number;
  period_id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface StaffNoteCreate {
  title: string;
  content: string;
}

export interface StaffNoteUpdate {
  title?: string;
  content?: string;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface NotesByCharacter {
  character_name: string;
  count: number;
}

export interface PriorityCount {
  priority: Priority;
  count: number;
}

export interface AnalyticsSummary {
  total_notes: number;
  notes_by_character: NotesByCharacter[];
  priority_distribution: PriorityCount[];
  private_directive_count: number;
  public_directive_count: number;
}

// ── Transactions ──────────────────────────────────────────────────────────────

export interface TransactionResponse {
  id: number;
  period_id: number;
  transaction_name: string;
  delegates: number[];
  delta: number;
  created_at: string;
}

export interface TransactionCreate {
  transaction_name: string;
  delegates: number[];
  delta: number;
}

export interface TransactionUpdate {
  transaction_name?: string;
  delegates?: number[];
  delta?: number;
}

// ── Misc (single row: group name, header image, net worth totals) ─────────────

export interface MiscResponse {
  id: number;
  group_name: string;
  header_image: string | null;
  total: number;
  total_at_end_of_prev_period: number;
}

export interface MiscUpdate {
  group_name?: string;
  header_image?: string | null;
  total?: number;
  total_at_end_of_prev_period?: number;
}

// ── Posts (Weverse posts) ─────────────────────────────────────────────────

export interface PostResponse {
  id: number;
  period_id: number;
  user_name: string;
  min_ago: number;
  message: string;
  likes: number;
  reply_to_id: number | null;
  is_artist: boolean;
}

export interface PostCreate {
  user_name: string;
  min_ago: number;
  message: string;
  likes?: number;
  reply_to_id?: number | null;
  is_artist?: boolean;
}

// ── Notices ───────────────────────────────────────────────────────────────────

export interface NoticeResponse {
  id: number;
  period_id: number;
  min_ago: number;
  message: string;
  likes: number;
}

export interface NoticeCreate {
  min_ago: number;
  message: string;
  likes?: number;
}

// ── Shop items ────────────────────────────────────────────────────────────────

export interface ItemResponse {
  id: number;
  period_id: number;
  title: string;
  cost: number;
  photo: string | null;
}

export interface ItemCreate {
  title: string;
  cost: number;
  photo?: string | null;
}
