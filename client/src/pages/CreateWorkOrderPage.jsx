import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createWorkOrder, getMachines, getUsers } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateWorkOrderPage() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    machine: '',
    priority: 'Medium',
    assignedTo: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [machinesRes, usersRes] = await Promise.all([
        getMachines(),
        getUsers({ role: 'Technician' }),
      ]);
      setMachines(machinesRes.data?.data ?? []);
      setTechnicians(usersRes.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createWorkOrder(form);
      toast.success('Work order created successfully');
      navigate('/work-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create work order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Work Order</h1>
          <p className="text-gray-500 mt-1">Create a new maintenance work order</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Work order title"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={form.description}
                  onChange={handleChange}
                  className="input-field"
                  rows="4"
                  placeholder="Describe the maintenance task"
                />
              </div>
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
                <label className="label" htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="assignedTo">Assign To (Technician)</label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Unassigned</option>
                  {technicians.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Creating...' : 'Create Work Order'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/work-orders')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
