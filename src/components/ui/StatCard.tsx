import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className={cn('p-2.5 rounded-xl', color)}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{label}</div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
      </div>
    </div>
  );
}
