"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCampaignAction } from "@/actions/admin/campaign.actions";

export function NewCampaignDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [internalName, setInternalName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    startTransition(async () => {
      const result = await createCampaignAction({ internalName });
      if (result.success) {
        setOpen(false);
        setInternalName("");
        router.push(`/admin/newsletter/campaigns/${result.data.id}`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold">
          <Plus data-icon="inline-start" />
          New campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>
            Give it an internal name — everything else (subject, content, audience) is edited next.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="campaign-internal-name">Internal name</Label>
          <Input
            id="campaign-internal-name"
            placeholder="e.g. August book announcement"
            value={internalName}
            onChange={(event) => setInternalName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleCreate();
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleCreate} disabled={isPending || internalName.trim().length < 2}>
            {isPending ? "Creating…" : "Create draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
