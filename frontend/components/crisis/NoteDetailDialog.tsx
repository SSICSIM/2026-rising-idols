"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CrisisNoteResponse } from "@/types/api";
import { NoteTypeBadge } from "./NoteTypeBadge";
import { PriorityBadge } from "./PriorityBadge";

interface Props {
  note: CrisisNoteResponse | null;
  onOpenChange: (open: boolean) => void;
}

export function NoteDetailDialog({ note, onOpenChange }: Props) {
  return (
    <Dialog open={note !== null} onOpenChange={onOpenChange}>
      <DialogContent className="grid-cols-[minmax(0,1fr)]">
        {note && (
          <>
            <DialogHeader>
              <DialogTitle>{note.title}</DialogTitle>
              <DialogDescription>
                {note.character.name} · {new Date(note.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={note.priority} />
              <NoteTypeBadge noteType={note.note_type} />
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                  Description
                </p>
                <p className="break-words whitespace-pre-wrap">{note.description || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                  Staff Notes
                </p>
                <p className="break-words whitespace-pre-wrap">{note.crisis_staff_notes || "—"}</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
