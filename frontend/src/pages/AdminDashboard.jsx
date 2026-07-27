import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiUserCheck, FiActivity } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import BarChartWidget from '../components/charts/BarChartWidget';
import PieChartWidget from '../components/charts/PieChartWidget';
import analyticsService from '../services/analyticsService';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [funnel, setFunnel] = useState({ labels: [], data: [] });
  const [skills, setSkills] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [overviewData, funnelData, skillsData] = await Promise.all([
          analyticsService.getOverview().catch(() => null),
          analyticsService.getHiringFunnel().catch(() => ({ labels: [], data: [] })),
          analyticsService.getTopSkills().catch(() => ({ labels: [], data: [] })),
        ]);
        if (mounted) {
          setOverview(overviewData);
          setFunnel(funnelData || { labels: [], data: [] });
          setSkills(skillsData || { labels: [], data: [] });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingSpinner fullscreen label="Loading platform overview..." />;

  const stats = [
    { icon: FiUsers, label: 'Total Users', value: overview?.total_users ?? 0, tone: 'brand' },
    { icon: FiBriefcase, label: 'Total Jobs', value: overview?.total_jobs ?? 0, tone: 'sky' },
    { icon: FiUserCheck, label: 'Total Candidates', value: overview?.total_candidates ?? 0, tone: 'emerald' },
    { icon: FiActivity, label: 'Applications', value: overview?.total_applications ?? 0, tone: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Platform-wide activity and hiring metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Hiring Funnel</h2>
          <BarChartWidget labels={funnel.labels} data={funnel.data} label="Candidates" horizontal />
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Top Skills in Demand</h2>
          <PieChartWidget labels={skills.labels} data={skills.data} />
        </div>
      </div>
    </div>
  );
}
