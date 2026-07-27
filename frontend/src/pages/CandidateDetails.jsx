import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import ResumePreview from '../components/ResumePreview';
import ScoreRing from '../components/ScoreRing';
import ProgressBar from '../components/ProgressBar';
import SkillBadge from '../components/SkillBadge';
import candidateService from '../services/candidateService';
import matchingService from '../services/matchingService';
import { initials } from '../utils/formatters';

export default function CandidateDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const [candidate, setCandidate] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [candidateData, matchData] = await Promise.all([
          candidateService.getCandidateById(id),
          jobId ? matchingService.getMatchDetail(jobId, id).catch(() => null) : Promise.resolve(null),
        ]);
        if (mounted) {
          setCandidate(candidateData);
          setMatch(matchData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, jobId]);

  if (loading) return <LoadingSpinner fullscreen label="Loading candidate profile..." />;
  if (!candidate) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/applicants" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <FiArrowLeft size={15} /> Back to applicants
      </Link>

      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 font-display text-xl font-bold text-white">
            {initials(candidate.name)}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.title || 'Candidate'}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><FiMail size={12} /> {candidate.email}</span>
              {candidate.location && <span className="flex items-center gap-1"><FiMapPin size={12} /> {candidate.location}</span>}
            </div>
          </div>
        </div>
        {match && <ScoreRing score={match.overall_score ?? 0} size={100} />}
      </div>

      {candidate.resume && <ResumePreview resume={candidate.resume} />}

      {candidate.bio && (
        <div className="card p-6">
          <h2 className="mb-3 font-display font-semibold text-slate-800 dark:text-white">Summary</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{candidate.bio}</p>
        </div>
      )}

      {match && (
        <div className="card space-y-4 p-6">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white">Match Breakdown</h2>
          <ProgressBar label="Skill Match" value={match.skill_match ?? 0} tone="brand" />
          <ProgressBar label="Experience Match" value={match.experience_match ?? 0} tone="amber" />
          <ProgressBar label="Education Match" value={match.education_match ?? 0} tone="emerald" />

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Matched Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(match.matched_skills || []).map((s) => <SkillBadge key={s} skill={s} variant="matched" />)}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Missing Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(match.missing_skills || []).map((s) => <SkillBadge key={s} skill={s} variant="missing" />)}
              </div>
            </div>
          </div>

          {match.recommendation && (
            <div className="rounded-lg bg-brand-50 p-4 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              <span className="font-semibold">AI Recommendation:</span> {match.recommendation}
            </div>
          )}
        </div>
      )}

      {candidate.skills?.length > 0 && !match && (
        <div className="card p-6">
          <h2 className="mb-3 font-display font-semibold text-slate-800 dark:text-white">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => <SkillBadge key={skill} skill={skill} variant="neutral" />)}
          </div>
        </div>
      )}
    </div>
  );
}
