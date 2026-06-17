import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getWorkOrder, assignTechnician, updateWorkOrderStatus, getUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isAdmin = user?.role === 'Admin';
  const isAssignedTechnician =
    user?.role === 'Technician' && workOrder?.assignedTo?._id === user?._id;
  const canUpdateStatus = isAdmin || isAssignedTechnician;

  const fetchWorkOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkOrder(id);
      const order = res.data?.data ?? res.data ?? res;
      setWorkOrder(order);
      setSelectedTechnician(order.assignedTo?._id || '');
      setSelectedStatus(order.status || '');
    } catch (err) {
      toast.error('Failed to load work order');
      navigate('/work-orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchTechnicians = useCallback(async () => {
    try {
      const res = await getUsers({ role: 'Technician' });
      setTechnicians(res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load technicians');
    }
  }, []);

  useEffect(() => {
    fetchWorkOrder();
    if (isAdmin) fetchTechnicians();
  }, [fetchWorkOrder, fetchTechnicians, isAdmin]);

  const handleAssign = async () => {
    if (!selectedTechnician) return;
    setAssigning(true);
    try {
      await assignTechnician(id, { assignedTo: selectedTechnician });
      toast.success('Technician assigned successfully');
      fetchWorkOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;
    setUpdatingStatus(true);
    try {
      await updateWorkOrderStatus(id, { status: selectedStatus });
      toast.success('Status updated successfully');
      fetchWorkOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (!workOrder) return null;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/work-orders')}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block"
          >
            &larr; Back to Work Orders
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{workOrder.title}</h1>
        </div>

        <div className="card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-900">{workOrder.description || 'No description'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Machine</h3>
              <p className="mt-1 text-gray-900">{workOrder.machine?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="mt-1">
                <StatusBadge value={workOrder.priority} type="priority" />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <StatusBadge value={workOrder.status} />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1 text-gray-900">{workOrder.assignedTo?.name || 'Unassigned'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1 text-gray-900">{workOrder.createdBy?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1 text-gray-900">{formatDate(workOrder.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
              <p className="mt-1 text-gray-900">{formatDate(workOrder.updatedAt)}</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Technician</h2>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="label" htmlFor="technician">Technician</label>
                <select
                  id="technician"
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a technician</option>
                  {technicians.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAssign}
                disabled={assigning || !selectedTechnician}
                className="btn-primary"
              >
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        )}

        {canUpdateStatus && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="label" htmlFor="status">Status</label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus || !selectedStatus}
                className="btn-primary"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
