export default function CircularGauge({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-slate-100 stroke-current"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-indigo-500 stroke-current transition-all duration-1000 ease-out"
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="text-[8px] font-bold fill-slate-900" textAnchor="middle">{value}</text>
        </svg>
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold text-slate-900">{label}</div>
        <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">{sublabel}</div>
      </div>
    </div>
  );
}
