"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  max?: number;
}

/** Simple chip-style tag editor — type + Enter (or comma) to add, click × to remove. */
export function TagsInput({ value, onChange, placeholder = "Add a tag…", max = 20 }: TagsInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim();
    if (!tag || value.length >= max || value.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 border-none bg-paper-100 text-stone-700">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full hover:text-destructive"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
