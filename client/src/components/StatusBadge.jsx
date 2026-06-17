// CSS class mappings for each status value
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

// CSS class mappings for each priority level
const priorityClasses = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
  Critical: 'badge-critical',
};

// Renders a coloured badge for a status or priority value
export default function StatusBadge({ value, type = 'status' }) {
  // Pick the correct class map based on the badge type
  const classMap = type === 'priority' ? priorityClasses : statusClasses;
  const badgeClass = classMap[value] || '';

  return <span className={badgeClass}>{value}</span>;
}
