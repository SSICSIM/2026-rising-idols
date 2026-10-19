"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CrisisNoteResponse } from "@/types/api";
import { NoteDetailDialog } from "./NoteDetailDialog";
import { NoteTypeBadge } from "./NoteTypeBadge";
import { PriorityBadge } from "./PriorityBadge";

interface Props {
  notes: CrisisNoteResponse[];
  readOnly?: boolean;
  onEdit?: (note: CrisisNoteResponse) => void;
  onDelete?: (id: number) => void;
}

export function NoteTable({ notes, readOnly = false, onEdit, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [detailNote, setDetailNote] = useState<CrisisNoteResponse | null>(null);

  if (notes.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">No notes yet.</p>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Character</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Staff Notes</TableHead>
              <TableHead className="text-right">Created</TableHead>
              {!readOnly && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow
                key={note.id}
                className="cursor-pointer"
                onClick={() => setDetailNote(note)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {note.character.name}
                </TableCell>
                <TableCell className="max-w-48">
                  <p className="truncate font-medium">{note.title}</p>
                  <p className="text-muted-foreground truncate text-xs">{note.description}</p>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={note.priority} />
                </TableCell>
                <TableCell>
                  <NoteTypeBadge noteType={note.note_type} />
                </TableCell>
                <TableCell className="max-w-40">
                  {note.crisis_staff_notes ? (
                    <p className="text-muted-foreground truncate text-xs">
                      {note.crisis_staff_notes}
                    </p>
                  ) : (
                    <span className="text-muted-foreground/40 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-xs whitespace-nowrap">
                  {new Date(note.created_at).toLocaleString()}
                </TableCell>
                {!readOnly && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(note);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(note.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <NoteDetailDialog note={detailNote} onOpenChange={(open) => !open && setDetailNote(null)} />

      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget !== null) onDelete?.(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
