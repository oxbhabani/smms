import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';
import { getWorkOrders, deleteWorkOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');

export default function WorkOrderListPage() {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isAdmin = user?.role === 'Admin';

  const fetchWorkOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (priority) params.priority = priority;
      if (status) params.status = status;
      const res = await getWorkOrders(params);
      setWorkOrders(res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  }, [search, priority, status]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      await deleteWorkOrder(selectedOrder._id);
      toast.success('Work order deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedOrder(null);
      fetchWorkOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete work order');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'machine',
      label: 'Machine',
      render: (row) => row.machine?.name || '-',
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => <StatusBadge value={row.priority} type="priority" />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge value={row.status} />,
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (row) => row.assignedTo?.name || '-',
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/work-orders/${row._id}`}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <FiEye size={16} />
          </Link>
          {isAdmin && (
            <button
              onClick={() => handleDeleteClick(row)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage maintenance work orders</p>
        </div>
        <Link to="/work-orders/create" className="btn-primary flex items-center gap-2">
          <FiPlus size={18} />
          Create Work Order
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search work orders..."
            />
          </div>
          <FilterDropdown
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={PRIORITY_OPTIONS}
          />
          <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={workOrders}
          loading={loading}
          emptyMessage="No work orders found"
        />
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Work Order"
        message={`Are you sure you want to delete "${selectedOrder?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedOrder(null);
        }}
      />
    </MainLayout>
  );
}
