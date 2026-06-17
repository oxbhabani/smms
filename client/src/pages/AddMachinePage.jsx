import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createMachine } from '../services/api';
import MainLayout from '../layouts/MainLayout';

const initialForm = {
  machineId: '',
  name: '',
  department: 'Production',
  manufacturer: '',
  installationDate: '',
  status: 'Running',
};

// Add Machine — form to register a new machine in the system
export default function AddMachinePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);  // tracks all machine form fields
  const [loading, setLoading] = useState(false);   // disables submit during API call

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // On submit: create machine via API, show success toast, redirect to list
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMachine(form);
      toast.success('Machine added successfully');
      navigate('/machines');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add machine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Machine</h1>
          <p className="text-gray-500 mt-1">Register a new machine in the system</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="machineId">Machine ID</label>
                <input
                  id="machineId"
                  name="machineId"
                  type="text"
                  required
                  value={form.machineId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. MCH-001"
                />
              </div>
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Machine name"
                />
              </div>
              <div>
                <label className="label" htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Production">Production</option>
                  <option value="Assembly">Assembly</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="manufacturer">Manufacturer</label>
                <input
                  id="manufacturer"
                  name="manufacturer"
                  type="text"
                  required
                  value={form.manufacturer}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Manufacturer name"
                />
              </div>
              <div>
                <label className="label" htmlFor="installationDate">Installation Date</label>
                <input
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  required
                  value={form.installationDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Running">Running</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Breakdown">Breakdown</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Add Machine'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/machines')}
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
