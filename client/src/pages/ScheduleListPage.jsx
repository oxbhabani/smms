import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getMachines } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');

const initialForm = {
  machine: '',
  maintenanceType: '',
  frequencyDays: '',
  nextMaintenanceDate: '',
  notes: '',
};

// Schedule list — view, create, edit, and delete recurring maintenance schedules
export default function ScheduleListPage() {
  const [schedules, setSchedules] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);  // toggle inline add/edit form
  const [editingId, setEditingId] = useState(null);  // null = creating, string = editing
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Fetch both schedules and machines list on mount
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSchedules();
      setSchedules(res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMachines = useCallback(async () => {
    try {
      const res = await getMachines();
      setMachines(res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load machines');
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchMachines();
  }, [fetchSchedules, fetchMachines]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Populate form with existing schedule data for editing
  const handleEdit = (schedule) => {
    setForm({
      machine: schedule.machine?._id || '',
      maintenanceType: schedule.maintenanceType || '',
      frequencyDays: schedule.frequencyDays || '',
      nextMaintenanceDate: schedule.nextMaintenanceDate
        ? schedule.nextMaintenanceDate.slice(0, 10)
        : '',
      notes: schedule.notes || '',
    });
    setEditingId(schedule._id);
    setShowForm(true);
  };

  // On submit: create or update schedule depending on editingId
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateSchedule(editingId, form);
        toast.success('Schedule updated successfully');
      } else {
        await createSchedule(form);
        toast.success('Schedule created successfully');
      }
      resetForm();
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSchedule) return;
    try {
      await deleteSchedule(selectedSchedule._id);
      toast.success('Schedule deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete schedule');
    }
  };

  const columns = [
    {
      key: 'machine',
      label: 'Machine Name',
      render: (row) => row.machine?.name || '-',
    },
    { key: 'maintenanceType', label: 'Maintenance Type' },
    {
      key: 'frequencyDays',
      label: 'Frequency',
      render: (row) => `${row.frequencyDays} days`,
    },
    {
      key: 'nextMaintenanceDate',
      label: 'Next Maintenance',
      render: (row) => formatDate(row.nextMaintenanceDate),
    },
    {
      key: 'lastMaintenanceDate',
      label: 'Last Maintenance',
      render: (row) => formatDate(row.lastMaintenanceDate),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
          <p className="text-gray-500 mt-1">Manage maintenance schedules</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={18} />
          Add Schedule
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Schedule' : 'New Schedule'}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="machine">Machine</label>
                <select
                  id="machine"
                  name="machine"
                  required
                  value={form.machine}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select a machine</option>
                  {machines.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="maintenanceType">Maintenance Type</label>
                <input
                  id="maintenanceType"
                  name="maintenanceType"
                  type="text"
                  required
                  value={form.maintenanceType}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Oil Change"
                />
              </div>
              <div>
                <label className="label" htmlFor="frequencyDays">Frequency (Days)</label>
                <input
                  id="frequencyDays"
                  name="frequencyDays"
                  type="number"
                  required
                  min="1"
                  value={form.frequencyDays}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. 30"
                />
              </div>
              <div>
                <label className="label" htmlFor="nextMaintenanceDate">Next Maintenance Date</label>
                <input
                  id="nextMaintenanceDate"
                  name="nextMaintenanceDate"
                  type="date"
                  required
                  value={form.nextMaintenanceDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Optional notes"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : editingId ? 'Update Schedule' : 'Create Schedule'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <DataTable
          columns={columns}
          data={schedules}
          loading={loading}
          emptyMessage="No schedules found"
        />
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Schedule"
        message={`Are you sure you want to delete this schedule? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedSchedule(null);
        }}
      />
    </MainLayout>
  );
}
