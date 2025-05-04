import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PlusCircle,
  title,
  ctaText,
  ctaHref,
}: {
  icon?: typeof PlusCircle;
  title: string;
  ctaText: string;
  ctaHref: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Icon className="h-12 w-12 text-brand-500" />
      <h3 className="text-lg font-medium">{title}</h3>
      <Button asChild>
        <a href={ctaHref}>{ctaText}</a>
      </Button>
    </div>
  );
}

