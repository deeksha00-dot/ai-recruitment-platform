import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiMapPin } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ScoreRing from '../components/ScoreRing';
import ProgressBar from '../components/ProgressBar';
import SkillBadge from '../components/SkillBadge';
import matchingService from '../services/matchingService';
import { useAuth } from '../context/AuthContext';

export default function MatchingResults() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let mounted = true;
    matchingService.getMatchesForCandidate(user.id)
      .then((data) => {
        if (!mounted) return;
        const list = data || [];
        setMatches(list);
        setSelected(list[0] || null);
      })
      .catch(() => mounted && setMatches([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [user?.id]);

  if (loading) return <LoadingSpinner fullscreen label="Calculating your matches..." />;

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={FiTarget}
        title="No matches yet"
        description="Upload your resume so we can match you against open roles."
        action={<Link to="/upload-resume" className="btn-primary">Upload Resume</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Matching Results</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Jobs ranked by how well your profile fits.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {matches.map((m) => (
            <button
              key={m.job_id}
              onClick={() => setSelected(m)}
              className={`w-full rounded-xl2 border p-4 text-left transition-colors ${
                selected?.job_id === m.job_id
                  ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'card hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{m.job_title}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <FiMapPin size={11} /> {m.location} · {m.company}
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-300">{Math.round(m.score)}%</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selected && (
            <div className="card space-y-6 p-6">
              <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{selected.job_title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selected.company} · {selected.location}</p>
                </div>
                <ScoreRing score={selected.score ?? 0} size={110} />
              </div>

              <div className="space-y-4">
                <ProgressBar label="Skill Match" value={selected.skill_match ?? selected.score ?? 0} tone="brand" />
                <ProgressBar label="Experience Match" value={selected.experience_match ?? 0} tone="amber" />
                <ProgressBar label="Education Match" value={selected.education_match ?? 0} tone="emerald" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Matched Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selected.matched_skills || []).map((s) => <SkillBadge key={s} skill={s} variant="matched" />)}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selected.missing_skills || []).map((s) => <SkillBadge key={s} skill={s} variant="missing" />)}
                  </div>
                </div>
              </div>

              {selected.recommendation && (
                <div className="rounded-lg bg-brand-50 p-4 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  <span className="font-semibold">AI Recommendation:</span> {selected.recommendation}
                </div>
              )}

              <Link to={`/jobs/${selected.job_id}`} className="btn-primary w-full justify-center">
                View Job & Apply
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
