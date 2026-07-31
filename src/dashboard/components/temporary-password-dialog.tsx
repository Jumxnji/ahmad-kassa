"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface TemporaryPasswordDialogProps {
  password: string | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Shown exactly once, right after a password is generated (new invite
 * or an admin-triggered reset) — there is no other way to see it again,
 * since only the hash is ever stored. Share it with the person
 * securely and have them change it on first login.
 */
export function TemporaryPasswordDialog({ password, onOpenChange }: TemporaryPasswordDialogProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={password !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Temporary password</DialogTitle>
          <DialogDescription>
            Shown once — share it securely and have them change it after signing in.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input readOnly value={password ?? ""} className="font-mono" />
          <Button type="button" variant="outline" size="icon" onClick={handleCopy} aria-label="Copy password">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="gold" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
