import { FiMail, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { initials } from '../utils/formatters';
import ScoreBadge from './ScoreBadge';

export default function CandidateCard({ candidate }) {
  return (
    <Link
      to={`/candidates/${candidate.id}`}
      className="card group flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-white">
            {initials(candidate.name)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-800 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
              {candidate.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.title || 'Candidate'}</p>
          </div>
        </div>
        {candidate.match_score !== undefined && <ScoreBadge score={candidate.match_score} showLabel={false} />}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(candidate.skills || []).slice(0, 5).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-white/5">
        <span className="flex items-center gap-1.5"><FiMail size={13} /> {candidate.email}</span>
        {candidate.location && <span className="flex items-center gap-1.5"><FiMapPin size={13} /> {candidate.location}</span>}
      </div>
    </Link>
  );
}
