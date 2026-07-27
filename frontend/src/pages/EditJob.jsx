import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import JobForm from '../components/JobForm';
import LoadingSpinner from '../components/LoadingSpinner';
import jobService from '../services/jobService';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    jobService.getJobById(id)
      .then((data) => mounted && setJob(data))
      .catch(() => toast.error('Could not load this job.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const handleSubmit = async (form) => {
    try {
      await jobService.updateJob(id, form);
      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (err) {
      toast.error(err?.message || 'Could not update this job.');
    }
  };

  if (loading) return <LoadingSpinner fullscreen label="Loading job..." />;
  if (!job) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Edit Job</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update the details for "{job.title}".</p>
      </div>
      <JobForm initialValue={job} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
