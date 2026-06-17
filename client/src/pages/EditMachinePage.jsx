import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMachine, updateMachine } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';

// Edit Machine — load existing machine data, then update it
export default function EditMachinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);    // starts null until data loads
  const [loading, setLoading] = useState(true);  // loading initial machine data
  const [saving, setSaving] = useState(false);   // disables submit during update

  // On mount: fetch machine by ID from URL, populate form fields
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await getMachine(id);
        const machine = res.data?.data ?? res.data ?? res;
        setForm({
          machineId: machine.machineId || '',
          name: machine.name || '',
          department: machine.department || 'Production',
          manufacturer: machine.manufacturer || '',
          installationDate: machine.installationDate
            ? machine.installationDate.slice(0, 10)
            : '',
          status: machine.status || 'Running',
        });
      } catch (err) {
        toast.error('Failed to load machine');
        navigate('/machines');
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // On submit: update machine via API, show toast, redirect to list
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMachine(id, form);
      toast.success('Machine updated successfully');
      navigate('/machines');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update machine');
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Machine</h1>
          <p className="text-gray-500 mt-1">Update machine details</p>
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
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Update Machine'}
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
