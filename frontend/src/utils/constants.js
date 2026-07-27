export const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  REVIEW: 'in_review',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  applied: 'Applied',
  in_review: 'In Review',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export const STATUS_COLORS = {
  applied: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  in_review: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  interview: 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  offer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  hired: 'bg-emerald-600 text-white',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

export const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_RESUME_SIZE_MB = 10;

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];
