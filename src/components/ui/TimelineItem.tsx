import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimelineItemProps {
  label: string;
  date: string;
  status: 'done' | 'active' | 'pending';
  active?: boolean;
}

export default function TimelineItem({ label, date, status, active }: TimelineItemProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center z-10',
          status === 'done' ? 'bg-emerald-500 text-white' :
          status === 'active' ? 'bg-indigo-600 text-white' :
          'bg-slate-100 text-slate-400'
        )}>
          {status === 'done' ? <CheckCircle2 size={14} /> : status === 'active' ? <Clock size={14} /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
        </div>
        <div className="w-0.5 h-full bg-slate-100 absolute top-6" />
      </div>
      <div className="pb-8 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className={cn('text-xs font-bold', active ? 'text-slate-900' : 'text-slate-500')}>{label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{date}</div>
          </div>
          <div className={cn(
            'text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider',
            status === 'done' ? 'bg-emerald-50 text-emerald-600' :
            status === 'active' ? 'bg-indigo-50 text-indigo-600' :
            'bg-slate-50 text-slate-400'
          )}>
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
