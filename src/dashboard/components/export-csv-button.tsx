"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { exportNewsletterCsvAction } from "@/actions/admin/newsletter.actions";
import type { $Enums } from "@/generated/prisma/client";

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportCsvButton({
  q,
  status,
  source,
}: {
  q?: string;
  status?: $Enums.SubscriberStatus;
  source?: $Enums.SubscriberSource;
}) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const result = await exportNewsletterCsvAction({ q, status, source });
      if (result.success) {
        downloadCsv(`newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`, result.data);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isPending}>
      <Download data-icon="inline-start" />
      {isPending ? "Exporting…" : "Export CSV"}
    </Button>
  );
}
