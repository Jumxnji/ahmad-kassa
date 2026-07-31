import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  status?: string;
}

export function PillarCard({
  icon: Icon,
  title,
  description,
  href,
  status,
}: PillarCardProps) {
  return (
    <Card className="group/pillar relative border-none shadow-none ring-1 ring-border transition-shadow duration-300 hover:shadow-md">
      <Link href={href} className="absolute inset-0" aria-label={title} />
      <CardHeader className="pt-6">
        <div className="flex items-start justify-between">
          <span className="flex size-10 items-center justify-center rounded-full bg-navy-50 text-navy-800">
            <Icon className="size-4.5" strokeWidth={1.5} />
          </span>
          {status && (
            <Badge variant="secondary" className="text-eyebrow border-none bg-gold-100 text-gold-700">
              {status}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-4 text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>
        <span className="mt-5 inline-flex items-center gap-1 text-sm text-navy-800 transition-transform duration-300 group-hover/pillar:translate-x-0.5">
          Explore
          <ArrowUpRight className="size-3.5" />
        </span>
      </CardContent>
    </Card>
  );
}
