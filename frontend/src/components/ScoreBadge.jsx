import { scoreTone } from '../utils/formatters';

const toneClasses = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

export default function ScoreBadge({ score = 0, showLabel = true }) {
  const { label, tone } = scoreTone(score);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold font-mono ${toneClasses[tone]}`}>
      {Math.round(score)}%
      {showLabel && <span className="hidden font-body font-medium sm:inline">· {label}</span>}
    </span>
  );
}
