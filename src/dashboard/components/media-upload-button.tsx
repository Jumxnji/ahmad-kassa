"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMediaAction } from "@/actions/admin/media.actions";
import type { $Enums } from "@/generated/prisma/client";

export function MediaUploadButton({ folder }: { folder: $Enums.MediaFolder }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleFiles(files: FileList) {
    startTransition(async () => {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", folder);
        const result = await uploadMediaAction(formData);
        if (!result.success) toast.error(result.message);
      }
      router.refresh();
    });
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <Button variant="gold" disabled={isPending} onClick={() => inputRef.current?.click()}>
        <Upload data-icon="inline-start" />
        {isPending ? "Uploading…" : "Upload files"}
      </Button>
    </>
  );
}
