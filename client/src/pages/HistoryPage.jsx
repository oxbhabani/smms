import { useFetch } from '../hooks/useFetch';
import { getHistory } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');

export default function HistoryPage() {
  const { data: history, loading } = useFetch(() => getHistory());

  const columns = [
    {
      key: 'machine',
      label: 'Machine',
      render: (row) => row.machine?.name || '-',
    },
    {
      key: 'technician',
      label: 'Technician',
      render: (row) => row.technician?.name || '-',
    },
    {
      key: 'workOrder',
      label: 'Work Order',
      render: (row) => row.workOrder?.title || '-',
    },
    {
      key: 'completionDate',
      label: 'Completion Date',
      render: (row) => formatDate(row.completionDate),
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (row) => row.remarks || '-',
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance History</h1>
        <p className="text-gray-500 mt-1">View completed maintenance records</p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={history ?? []}
          loading={loading}
          emptyMessage="No history records found"
        />
      </div>
    </MainLayout>
  );
}
