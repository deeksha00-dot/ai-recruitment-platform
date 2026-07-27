import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMapPin, FiBriefcase, FiUsers, FiEdit2, FiTrash2, FiClock, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import jobService from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate, timeAgo } from '../utils/formatters';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    jobService.getJobById(id)
      .then((data) => mounted && setJob(data))
      .catch(() => toast.error('Could not load this job.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <LoadingSpinner fullscreen label="Loading job details..." />;
  if (!job) return null;

  const isRecruiter = role === ROLES.RECRUITER || role === ROLES.ADMIN;

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobService.applyToJob(id);
      setApplied(true);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err?.message || 'Could not submit your application.');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobService.deleteJob(id);
      toast.success('Job deleted.');
      navigate('/jobs');
    } catch (err) {
      toast.error(err?.message || 'Could not delete this job.');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="card p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-display text-xl font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              {job.company?.[0]?.toUpperCase() || 'J'}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{job.title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
            </div>
          </div>

          {isRecruiter ? (
            <div className="flex gap-2">
              <Link to={`/jobs/${id}/edit`} className="btn-secondary">
                <FiEdit2 size={14} /> Edit
              </Link>
              <button onClick={() => setDeleteOpen(true)} className="btn-danger">
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          ) : (
            <button onClick={handleApply} disabled={applying || applied} className="btn-primary">
              {applied ? <><FiCheckCircle size={15} /> Applied</> : applying ? 'Submitting...' : 'Apply Now'}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500 dark:border-white/5 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><FiMapPin size={14} /> {job.location}</span>
          <span className="flex items-center gap-1.5"><FiBriefcase size={14} /> {job.type}</span>
          <span className="flex items-center gap-1.5"><FiUsers size={14} /> {job.applicant_count ?? 0} applicants</span>
          <span className="flex items-center gap-1.5"><FiClock size={14} /> Posted {timeAgo(job.created_at)}</span>
        </div>

        {isRecruiter && (
          <Link to={`/applicants?job=${id}`} className="btn-secondary mt-5 w-full justify-center sm:w-auto">
            <FiUsers size={15} /> View Applicants
          </Link>
        )}
      </div>

      <div className="card p-6">
        <h2 className="mb-3 font-display font-semibold text-slate-800 dark:text-white">Job Description</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{job.description}</p>
      </div>

      {job.requirements?.length > 0 && (
        <div className="card p-6">
          <h2 className="mb-3 font-display font-semibold text-slate-800 dark:text-white">Requirements</h2>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            {job.requirements.map((req) => <li key={req}>{req}</li>)}
          </ul>
        </div>
      )}

      {job.skills?.length > 0 && (
        <div className="card p-6">
          <h2 className="mb-3 font-display font-semibold text-slate-800 dark:text-white">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">Application deadline: {formatDate(job.deadline)}</p>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this job posting?"
        footer={
          <>
            <button onClick={() => setDeleteOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger">
              {deleting ? 'Deleting...' : 'Delete Job'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This will permanently remove "{job.title}" and its applicant data. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
