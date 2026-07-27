import { useEffect, useState } from 'react';
import { FiUsers, FiTrendingUp } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import BarChartWidget from '../components/charts/BarChartWidget';
import PieChartWidget from '../components/charts/PieChartWidget';
import LineChartWidget from '../components/charts/LineChartWidget';
import ScoreBadge from '../components/ScoreBadge';
import EmptyState from '../components/EmptyState';
import analyticsService from '../services/analyticsService';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [applicationsTrend, setApplicationsTrend] = useState({ labels: [], data: [] });
  const [topSkills, setTopSkills] = useState({ labels: [], data: [] });
  const [funnel, setFunnel] = useState({ labels: [], data: [] });
  const [topCandidates, setTopCandidates] = useState([]);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      analyticsService.getApplicationsPerDay(range).catch(() => ({ labels: [], data: [] })),
      analyticsService.getTopSkills().catch(() => ({ labels: [], data: [] })),
      analyticsService.getHiringFunnel().catch(() => ({ labels: [], data: [] })),
      analyticsService.getTopCandidates().catch(() => []),
    ]).then(([trend, skills, funnelData, candidates]) => {
      if (!mounted) return;
      setApplicationsTrend(trend || { labels: [], data: [] });
      setTopSkills(skills || { labels: [], data: [] });
      setFunnel(funnelData || { labels: [], data: [] });
      setTopCandidates(candidates || []);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [range]);

  if (loading) return <LoadingSpinner fullscreen label="Crunching hiring analytics..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Insights across jobs, applicants, and hiring speed.</p>
        </div>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="input w-40">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-brand-500" size={18} />
            <h2 className="font-display font-semibold text-slate-800 dark:text-white">Applications Per Day</h2>
          </div>
          <LineChartWidget labels={applicationsTrend.labels} data={applicationsTrend.data} />
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Top Skills</h2>
          <PieChartWidget labels={topSkills.labels} data={topSkills.data} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Hiring Funnel</h2>
          <BarChartWidget labels={funnel.labels} data={funnel.data} label="Candidates" />
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <FiUsers className="text-brand-500" size={18} />
            <h2 className="font-display font-semibold text-slate-800 dark:text-white">Top Candidates</h2>
          </div>
          {topCandidates.length === 0 ? (
            <EmptyState title="No candidate data yet" description="Rankings appear once matching has run." />
          ) : (
            <div className="space-y-3">
              {topCandidates.slice(0, 6).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 dark:border-white/5">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</p>
                  <ScoreBadge score={c.score} showLabel={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
