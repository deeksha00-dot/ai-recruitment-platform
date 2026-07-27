import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-light px-6 text-center dark:bg-surface-dark">
      <p className="font-mono text-7xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <FiArrowLeft size={15} /> Back to Home
      </Link>
    </div>
  );
}
