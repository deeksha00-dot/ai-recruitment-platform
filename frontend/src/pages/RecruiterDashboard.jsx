import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiCheckCircle, FiXCircle, FiArrowRight, FiPlusCircle } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import LineChartWidget from '../components/charts/LineChartWidget';
import jobService from '../services/jobService';
import analyticsService from '../services/analyticsService';
import { formatDate } from '../utils/formatters';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [jobsData, overviewData, trendData] = await Promise.all([
          jobService.getJobs({ mine: true }).catch(() => ({ items: [] })),
          analyticsService.getOverview().catch(() => null),
          analyticsService.getApplicationsPerDay('14d').catch(() => ({ labels: [], data: [] })),
        ]);
        if (mounted) {
          setJobs(jobsData?.items || jobsData || []);
          setOverview(overviewData);
          setTrend(trendData || { labels: [], data: [] });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingSpinner fullscreen label="Loading recruiter dashboard..." />;

  const stats = [
    { icon: FiBriefcase, label: 'Total Jobs', value: overview?.total_jobs ?? jobs.length, tone: 'brand' },
    { icon: FiUsers, label: 'Candidates', value: overview?.total_candidates ?? 0, tone: 'sky' },
    { icon: FiCheckCircle, label: 'Offers', value: overview?.offers ?? 0, tone: 'emerald' },
    { icon: FiXCircle, label: 'Rejected', value: overview?.rejected ?? 0, tone: 'rose' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage jobs, applicants, and hiring performance.</p>
        </div>
        <Link to="/jobs/create" className="btn-primary">
          <FiPlusCircle size={15} /> Create Job
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Applications (Last 14 Days)</h2>
          <LineChartWidget labels={trend.labels} data={trend.data} />
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white">Active Job Postings</h2>
            <Link to="/jobs" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          {jobs.length === 0 ? (
            <EmptyState icon={FiBriefcase} title="No jobs posted yet" description="Create your first job to start receiving applicants." />
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 6).map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{job.title}</p>
                    <p className="text-xs text-slate-400">Posted {formatDate(job.created_at)}</p>
                  </div>
                  <StatusBadge status={job.status || 'applied'} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
