import { STATUS_LABELS, STATUS_COLORS } from '../utils/constants';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.applied}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
