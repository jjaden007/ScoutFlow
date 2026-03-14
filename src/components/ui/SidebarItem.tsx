import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-300 group',
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
      )}
    >
      <Icon
        size={18}
        className={cn(
          'transition-colors duration-300',
          active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
        )}
      />
      <span className="text-sm tracking-tight">{label}</span>
    </button>
  );
}
