import { FiCheck, FiX } from 'react-icons/fi';

export default function SkillBadge({ skill, variant = 'matched' }) {
  const variants = {
    matched: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
    missing: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]}`}>
      {variant === 'matched' && <FiCheck size={12} />}
      {variant === 'missing' && <FiX size={12} />}
      {skill}
    </span>
  );
}
