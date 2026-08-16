"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resendNewsletterConfirmation } from "@/actions/public/newsletter";

export function ResendConfirmationButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await resendNewsletterConfirmation(email);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button type="button" variant="gold" size="lg" disabled={isPending} onClick={handleClick}>
      {isPending ? "Sending…" : "Send a new confirmation email"}
    </Button>
  );
}
