export function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, options);
  } catch {
    return value;
  }
}

export function timeAgo(value) {
  if (!value) return '—';
  const now = new Date();
  const then = new Date(value);
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(value);
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export function truncate(text = '', length = 120) {
  if (!text || text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function scoreTone(score) {
  if (score >= 85) return { label: 'Excellent Fit', tone: 'emerald' };
  if (score >= 70) return { label: 'Strong Fit', tone: 'brand' };
  if (score >= 50) return { label: 'Moderate Fit', tone: 'amber' };
  return { label: 'Low Fit', tone: 'rose' };
}
