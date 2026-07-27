import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import JobForm from '../components/JobForm';
import jobService from '../services/jobService';

export default function CreateJob() {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    try {
      const job = await jobService.createJob(form);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${job?.id || ''}`);
    } catch (err) {
      toast.error(err?.message || 'Could not create this job.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create Job</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Post a new opening and start matching candidates.</p>
      </div>
      <JobForm onSubmit={handleSubmit} submitLabel="Publish Job" />
    </div>
  );
}
