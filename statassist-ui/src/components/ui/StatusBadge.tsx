import { Badge } from '@/components/ui/badge';

const colourMap = {
  draft: 'bg-slate-400',
  active: 'bg-brand-500',
  paused: 'bg-amber-500',
  archived: 'bg-red-500',
} as const;

export default function StatusBadge({
  status,
}: {
  status: keyof typeof colourMap;
}) {
  return (
    <Badge className={`${colourMap[status]} capitalize`}>
      {status}
    </Badge>
  );
}

