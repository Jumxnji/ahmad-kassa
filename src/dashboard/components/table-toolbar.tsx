import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableSearchFormProps {
  /** The page path the form submits to, e.g. "/admin/books". */
  action: string;
  placeholder: string;
  defaultValue?: string;
  /** Other query params to carry through unchanged (sort, dir, folder, view…). */
  preserve?: Record<string, string | undefined>;
  className?: string;
}

/**
 * A plain GET form — search works without client JS, matches the
 * folder-filter pattern already used on the Media Library page, and
 * keeps every list page a Server Component.
 */
export function TableSearchForm({
  action,
  placeholder,
  defaultValue,
  preserve,
  className,
}: TableSearchFormProps) {
  return (
    <form action={action} method="GET" className={className ?? "flex w-full gap-2 sm:w-auto"}>
      {Object.entries(preserve ?? {}).map(([key, value]) =>
        value ? <input key={key} type="hidden" name={key} value={value} /> : null
      )}
      <div className="relative flex-1 sm:w-64 sm:flex-none">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" placeholder={placeholder} defaultValue={defaultValue} className="pl-9" />
      </div>
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
}
