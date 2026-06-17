import { useFetch } from '../hooks/useFetch';
import { getLogs } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';

const formatDate = (date) => (date ? new Date(date).toLocaleString() : '-');

export default function LogsPage() {
  const { data: logs, loading } = useFetch(() => getLogs());

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row) => row.user?.name || '-',
    },
    { key: 'action', label: 'Action' },
    {
      key: 'createdAt',
      label: 'Timestamp',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500 mt-1">System-wide activity log</p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={logs ?? []}
          loading={loading}
          emptyMessage="No logs found"
        />
      </div>
    </MainLayout>
  );
}
