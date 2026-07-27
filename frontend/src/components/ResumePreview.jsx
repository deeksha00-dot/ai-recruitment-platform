import { FiFileText, FiDownload, FiExternalLink } from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

export default function ResumePreview({ resume }) {
  if (!resume) return null;

  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-500/10">
        <FiFileText size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-700 dark:text-slate-200">{resume.filename || 'resume.pdf'}</p>
        <p className="text-xs text-slate-400">Uploaded {formatDate(resume.uploaded_at)}</p>
      </div>
      <div className="flex gap-2">
        {resume.url && (
          <a href={resume.url} target="_blank" rel="noreferrer" className="btn-secondary !px-3 !py-2" aria-label="View resume">
            <FiExternalLink size={15} />
          </a>
        )}
        {resume.url && (
          <a href={resume.url} download className="btn-secondary !px-3 !py-2" aria-label="Download resume">
            <FiDownload size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
