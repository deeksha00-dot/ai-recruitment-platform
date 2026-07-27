const toneClasses = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
};

export default function StatCard({ icon: Icon, label, value, trend, tone = 'brand' }) {
  return (
    <div className="card flex items-center gap-4 p-5 animate-fadeIn">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="font-mono text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          {trend && (
            <span className={`text-xs font-semibold ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
