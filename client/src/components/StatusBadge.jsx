const statusClasses = {
  Running: 'badge-running',
  Maintenance: 'badge-maintenance',
  Breakdown: 'badge-breakdown',
  Offline: 'badge-offline',
  Open: 'badge-open',
  'In Progress': 'badge-in-progress',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled',
};

const priorityClasses = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
  Critical: 'badge-critical',
};

export default function StatusBadge({ value, type = 'status' }) {
  const classMap = type === 'priority' ? priorityClasses : statusClasses;
  const badgeClass = classMap[value] || '';

  return <span className={badgeClass}>{value}</span>;
}
