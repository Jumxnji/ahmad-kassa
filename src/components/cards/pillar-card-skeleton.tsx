import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PillarCardSkeleton() {
  return (
    <Card className="border-none shadow-none ring-1 ring-border">
      <CardHeader className="pt-6">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="mt-4 h-6 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2 pb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-4 h-4 w-20" />
      </CardContent>
    </Card>
  );
}
