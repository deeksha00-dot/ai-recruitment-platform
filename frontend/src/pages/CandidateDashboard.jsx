import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiCheckCircle, FiTarget, FiClock, FiArrowRight, FiUpload } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import ScoreBadge from '../components/ScoreBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import candidateService from '../services/candidateService';
import matchingService from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [apps, matchData] = await Promise.all([
          candidateService.getMyApplications().catch(() => []),
          user?.id ? matchingService.getMatchesForCandidate(user.id).catch(() => []) : Promise.resolve([]),
        ]);
        if (mounted) {
          setApplications(apps || []);
          setMatches(matchData || []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  if (loading) return <LoadingSpinner fullscreen label="Loading your dashboard..." />;

  const stats = [
    { icon: FiBriefcase, label: 'Applied Jobs', value: applications.length, tone: 'brand' },
    { icon: FiTarget, label: 'Matched Jobs', value: matches.length, tone: 'sky' },
    { icon: FiCheckCircle, label: 'Interviews', value: applications.filter((a) => a.status === 'interview').length, tone: 'emerald' },
    { icon: FiClock, label: 'In Review', value: applications.filter((a) => a.status === 'in_review').length, tone: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Candidate Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your applications and top job matches.</p>
        </div>
        <Link to="/upload-resume" className="btn-primary">
          <FiUpload size={15} /> Upload Resume
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white">Recent Applications</h2>
            <Link to="/jobs" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
              Browse jobs <FiArrowRight size={14} />
            </Link>
          </div>
          {applications.length === 0 ? (
            <EmptyState icon={FiBriefcase} title="No applications yet" description="Apply to a job to see its status here." />
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 6).map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{app.job_title}</p>
                    <p className="text-xs text-slate-400">{app.company} · Applied {formatDate(app.applied_at)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white">Top Matches</h2>
            <Link to="/matching-results" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          {matches.length === 0 ? (
            <EmptyState icon={FiTarget} title="No matches yet" description="Upload your resume to get matched to jobs." />
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 5).map((m) => (
                <div key={m.job_id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{m.job_title}</p>
                    <p className="text-xs text-slate-400">{m.company}</p>
                  </div>
                  <ScoreBadge score={m.score} showLabel={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
