import { useEffect, useMemo, useState } from 'react';
import { FiBriefcase, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import useDebounce from '../hooks/useDebounce';
import usePagination from '../hooks/usePagination';
import jobService from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { JOB_TYPES, ROLES } from '../utils/constants';

export default function JobListings() {
  const { role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let mounted = true;
    jobService.getJobs()
      .then((data) => mounted && setJobs(data?.items || data || []))
      .catch(() => mounted && setJobs([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !debouncedSearch ||
        job.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.company?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = !type || job.type === type;
      return matchesSearch && matchesType;
    });
  }, [jobs, debouncedSearch, type]);

  const { paginated, page, totalPages, goToPage } = usePagination(filtered, 9);

  if (loading) return <LoadingSpinner fullscreen label="Loading job listings..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Job Listings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{filtered.length} open positions</p>
        </div>
        {(role === ROLES.RECRUITER || role === ROLES.ADMIN) && (
          <Link to="/jobs/create" className="btn-primary">
            <FiPlusCircle size={15} /> Create Job
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title or company..." className="flex-1" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="input sm:w-52">
          <option value="">All job types</option>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {paginated.length === 0 ? (
        <EmptyState icon={FiBriefcase} title="No jobs found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
