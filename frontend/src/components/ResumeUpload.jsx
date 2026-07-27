import { useCallback, useRef, useState } from 'react';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { ACCEPTED_RESUME_TYPES, MAX_RESUME_SIZE_MB } from '../utils/constants';
import { validateResumeFile } from '../utils/validators';
import { formatFileSize } from '../utils/formatters';
import candidateService from '../services/candidateService';

export default function ResumeUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selected) => {
    const errors = validateResumeFile(selected, ACCEPTED_RESUME_TYPES, MAX_RESUME_SIZE_MB);
    if (errors.length) {
      errors.forEach((e) => toast.error(e));
      return;
    }
    setFile(selected);
    setSuccess(false);
    setProgress(0);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await candidateService.uploadResume(file, setProgress);
      setSuccess(true);
      toast.success('Resume uploaded successfully!');
      onUploaded?.(result);
    } catch (err) {
      toast.error(err?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setSuccess(false);
  };

  return (
    <div>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed px-6 py-14 text-center transition-colors ${
            dragActive
              ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
              : 'border-slate-200 bg-slate-50/50 hover:border-brand-300 dark:border-white/10 dark:bg-white/[0.02]'
          }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-500 dark:bg-brand-500/10">
            <FiUploadCloud size={26} />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-200">Drag & drop your resume here</p>
          <p className="mt-1 text-sm text-slate-400">or click to browse · PDF or DOCX · up to {MAX_RESUME_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              {success ? <FiCheckCircle size={22} className="text-emerald-500" /> : <FiFile size={20} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>
            {!uploading && (
              <button onClick={reset} className="text-slate-400 hover:text-rose-500" aria-label="Remove file">
                <FiX size={18} />
              </button>
            )}
          </div>

          {(uploading || progress > 0) && !success && (
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}

          {!success ? (
            <button onClick={handleUpload} disabled={uploading} className="btn-primary mt-4 w-full">
              {uploading ? `Uploading... ${progress}%` : 'Upload Resume'}
            </button>
          ) : (
            <button onClick={reset} className="btn-secondary mt-4 w-full">
              Upload another file
            </button>
          )}
        </div>
      )}
    </div>
  );
}
