import { cn } from '@/lib/utils';
import { RequestStatus } from '@/types/database';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-status-new-bg text-status-new border-status-new/20',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-status-progress-bg text-status-progress border-status-progress/20',
  },
  repaired: {
    label: 'Repaired',
    className: 'bg-status-repaired-bg text-status-repaired border-status-repaired/20',
  },
  scrapped: {
    label: 'Scrapped',
    className: 'bg-status-scrapped-bg text-status-scrapped border-status-scrapped/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'new' && 'bg-status-new',
          status === 'in_progress' && 'bg-status-progress',
          status === 'repaired' && 'bg-status-repaired',
          status === 'scrapped' && 'bg-status-scrapped'
        )}
      />
      {config.label}
    </span>
  );
}
