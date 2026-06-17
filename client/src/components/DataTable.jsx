import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

// Renders a dynamic table with loading, empty, and data states
export default function DataTable({
  columns = [], // Array of { key, label, render? }
  data = [],
  loading = false,
  emptyMessage,
  onRowClick, // Called with the row object when a row is clicked
}) {
  // Show spinner while data is loading
  if (loading) return <LoadingSpinner />;

  // Show empty state when there are no rows
  if (!data.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIdx) => (
            <tr
              key={row._id || row.id || rowIdx}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50'}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {/* Use custom render function if provided, otherwise show raw value */}
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
