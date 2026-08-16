"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addInternalNoteAction } from "@/actions/admin/question.actions";
import { formatDate } from "@/lib/format";

interface InternalNoteRow {
  id: string;
  note: string;
  createdAt: Date;
  author: { id: string; name: string } | null;
}

export function InternalNotesPanel({ questionId, notes }: { questionId: string; notes: InternalNoteRow[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!draft.trim()) return;
    startTransition(async () => {
      const result = await addInternalNoteAction(questionId, { note: draft });
      if (result.success) {
        setDraft("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-4 rounded-lg border border-gold-400/30 bg-gold-50 p-5">
      <div className="flex items-center gap-2 text-xs font-medium text-gold-700">
        <Lock className="size-3.5" />
        Internal notes — staff only, never visible to the visitor
      </div>

      {notes.length > 0 && (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-md bg-white/70 p-3 text-sm">
              <p className="leading-relaxed text-foreground/90">{note.note}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {note.author?.name ?? "Unknown"} · {formatDate(note.createdAt.toISOString())}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a private note for other admins…"
          rows={3}
          className="bg-white"
        />
        <Button type="button" size="sm" variant="outline" disabled={isPending || !draft.trim()} onClick={handleSubmit}>
          {isPending ? "Adding…" : "Add note"}
        </Button>
      </div>
    </div>
  );
}
