import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUsers, FiEye } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ScoreBadge from '../components/ScoreBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import jobService from '../services/jobService';
import useDebounce from '../hooks/useDebounce';
import { initials } from '../utils/formatters';
import { APPLICATION_STATUS, STATUS_LABELS } from '../utils/constants';

export default function Applicants() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    jobService.getApplicants(jobId)
      .then((data) => mounted && setApplicants(data?.items || data || []))
      .catch(() => mounted && setApplicants([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [jobId]);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch = !debouncedSearch || a.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, debouncedSearch, statusFilter]);

  const updateStatus = async (applicationId, status) => {
    try {
      await jobService.updateApplicationStatus(jobId, applicationId, status);
      setApplicants((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)));
      toast.success('Application status updated.');
    } catch (err) {
      toast.error(err?.message || 'Could not update status.');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Candidate',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
            {initials(row.name)}
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'match_score',
      label: 'Match Score',
      sortable: true,
      render: (row) => <ScoreBadge score={row.match_score ?? 0} showLabel={false} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => updateStatus(row.id, e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
        >
          {Object.values(APPLICATION_STATUS).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Link to={`/candidates/${row.candidate_id || row.id}`} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          <FiEye size={14} /> View
        </Link>
      ),
    },
  ];

  if (!jobId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-slate-200 px-6 py-16 text-center dark:border-white/10">
        <FiUsers size={28} className="mb-3 text-slate-300" />
        <h2 className="font-semibold text-slate-700 dark:text-slate-200">Select a job to view applicants</h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Open a job from your listings and click "View Applicants".</p>
        <Link to="/jobs" className="btn-primary mt-5">Browse Jobs</Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner fullscreen label="Loading applicants..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Applicants</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{filtered.length} candidates for this role</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search candidates..." className="flex-1" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-52">
          <option value="">All statuses</option>
          {Object.values(APPLICATION_STATUS).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No applicants match your filters." />
    </div>
  );
}
