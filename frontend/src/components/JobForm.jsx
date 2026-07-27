import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';
import { validateJob, hasErrors } from '../utils/validators';

const emptyJob = {
  title: '',
  company: '',
  location: '',
  type: JOB_TYPES[0],
  experience_level: EXPERIENCE_LEVELS[0],
  description: '',
  requirements: [],
  skills: [],
  deadline: '',
};

export default function JobForm({ initialValue, onSubmit, submitLabel = 'Publish Job' }) {
  const [form, setForm] = useState({ ...emptyJob, ...initialValue });
  const [errors, setErrors] = useState({});
  const [reqInput, setReqInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addToList = (key, value, setter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm((f) => ({ ...f, [key]: [...(f[key] || []), trimmed] }));
    setter('');
  };

  const removeFromList = (key, value) => setForm((f) => ({ ...f, [key]: f[key].filter((v) => v !== value) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateJob(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">Job title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Senior Backend Engineer" className="input" />
          {errors.title && <p className="mt-1.5 text-xs text-rose-500">{errors.title}</p>}
        </div>
        <div>
          <label className="label" htmlFor="company">Company</label>
          <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc." className="input" />
          {errors.company && <p className="mt-1.5 text-xs text-rose-500">{errors.company}</p>}
        </div>
        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Bengaluru, India" className="input" />
          {errors.location && <p className="mt-1.5 text-xs text-rose-500">{errors.location}</p>}
        </div>
        <div>
          <label className="label" htmlFor="type">Job type</label>
          <select id="type" name="type" value={form.type} onChange={handleChange} className="input">
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <p className="mt-1.5 text-xs text-rose-500">{errors.type}</p>}
        </div>
        <div>
          <label className="label" htmlFor="experience_level">Experience level</label>
          <select id="experience_level" name="experience_level" value={form.experience_level} onChange={handleChange} className="input">
            {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="deadline">Application deadline</label>
          <input id="deadline" name="deadline" type="date" value={form.deadline?.slice(0, 10) || ''} onChange={handleChange} className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the role, responsibilities, and team..." className="input resize-none" />
        {errors.description && <p className="mt-1.5 text-xs text-rose-500">{errors.description}</p>}
      </div>

      <div>
        <label className="label">Requirements</label>
        <div className="flex gap-2">
          <input
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('requirements', reqInput, setReqInput))}
            placeholder="e.g. 5+ years of React experience"
            className="input"
          />
          <button type="button" onClick={() => addToList('requirements', reqInput, setReqInput)} className="btn-secondary shrink-0 !px-3.5">
            <FiPlus size={16} />
          </button>
        </div>
        <ul className="mt-3 space-y-1.5">
          {(form.requirements || []).map((req) => (
            <li key={req} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
              {req}
              <button type="button" onClick={() => removeFromList('requirements', req)} aria-label={`Remove ${req}`}>
                <FiX size={14} className="text-slate-400 hover:text-rose-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="label">Required skills</label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('skills', skillInput, setSkillInput))}
            placeholder="e.g. TypeScript"
            className="input"
          />
          <button type="button" onClick={() => addToList('skills', skillInput, setSkillInput)} className="btn-secondary shrink-0 !px-3.5">
            <FiPlus size={16} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(form.skills || []).map((skill) => (
            <span key={skill} className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              {skill}
              <button type="button" onClick={() => removeFromList('skills', skill)} aria-label={`Remove ${skill}`}>
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
