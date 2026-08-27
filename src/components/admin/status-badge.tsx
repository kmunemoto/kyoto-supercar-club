import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_TONE, isApplicationStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const label = isApplicationStatus(status) ? STATUS_LABEL[status] : status;
  const tone = isApplicationStatus(status) ? STATUS_TONE[status] : "bg-line text-muted";
  return <Badge className={cn(tone)}>{label}</Badge>;
}
