import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import ResumeUpload from '../components/ResumeUpload';

const tips = [
  'Use a clean, single-column layout for the most accurate parsing.',
  'List skills explicitly — our AI matches on exact and related terms.',
  'Keep your most recent role and dates near the top.',
];

export default function UploadResume() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Upload Resume</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We'll parse your resume and start matching you to relevant jobs automatically.
        </p>
      </div>

      <ResumeUpload onUploaded={() => setTimeout(() => navigate('/matching-results'), 1200)} />

      <div className="card p-5">
        <h2 className="mb-3 font-display font-semibold text-slate-800 dark:text-white">Tips for best results</h2>
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
              <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={15} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
