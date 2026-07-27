import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiPlus, FiX } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import ResumePreview from '../components/ResumePreview';
import candidateService from '../services/candidateService';

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    let mounted = true;
    candidateService.getMyProfile()
      .then((data) => mounted && setProfile(data))
      .catch(() => mounted && setProfile({ name: '', email: '', title: '', location: '', bio: '', skills: [] }))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingSpinner fullscreen label="Loading your profile..." />;

  const handleChange = (e) => setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (!profile.skills?.includes(value)) {
      setProfile((p) => ({ ...p, skills: [...(p.skills || []), value] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await candidateService.updateMyProfile(profile);
      setProfile(updated || profile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep your profile current for the best job matches.</p>
      </div>

      {profile?.resume && <ResumePreview resume={profile.resume} />}

      <form onSubmit={handleSave} className="card space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" value={profile?.name || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="title">Professional title</label>
            <input id="title" name="title" value={profile?.title || ''} onChange={handleChange} placeholder="Senior Frontend Engineer" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={profile?.email || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="location">Location</label>
            <input id="location" name="location" value={profile?.location || ''} onChange={handleChange} placeholder="Bengaluru, India" className="input" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="bio">Summary</label>
          <textarea id="bio" name="bio" value={profile?.bio || ''} onChange={handleChange} rows={4} placeholder="A short summary of your experience..." className="input resize-none" />
        </div>

        <div>
          <label className="label">Skills</label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill and press Enter"
              className="input"
            />
            <button type="button" onClick={addSkill} className="btn-secondary shrink-0 !px-3.5">
              <FiPlus size={16} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile?.skills || []).map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <FiSave size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
