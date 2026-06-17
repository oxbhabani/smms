import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getMachines, deleteMachine } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';

const DEPARTMENT_OPTIONS = [
  { value: '', label: 'All Departments' },
  { value: 'Production', label: 'Production' },
  { value: 'Assembly', label: 'Assembly' },
  { value: 'Packaging', label: 'Packaging' },
  { value: 'Warehouse', label: 'Warehouse' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Running', label: 'Running' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Breakdown', label: 'Breakdown' },
  { value: 'Offline', label: 'Offline' },
];

// Machine list — search, filter, view, edit, and delete machines
export default function MachineListPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');           // search term (machine ID)
  const [department, setDepartment] = useState('');   // department filter
  const [status, setStatus] = useState('');           // status filter
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Fetch machines with optional search/filter query params
  const fetchMachines = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.machineId = search;
      if (department) params.department = department;
      if (status) params.status = status;
      const res = await getMachines(params);
      setMachines(res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load machines');
    } finally {
      setLoading(false);
    }
  }, [search, department, status]);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  const handleDeleteClick = (machine) => {
    setSelectedMachine(machine);
    setShowDeleteConfirm(true);
  };

  // Confirm dialog accepted: delete the selected machine, then refresh
  const handleDeleteConfirm = async () => {
    if (!selectedMachine) return;
    try {
      await deleteMachine(selectedMachine._id);
      toast.success('Machine deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedMachine(null);
      fetchMachines();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete machine');
    }
  };

  const columns = [
    { key: 'machineId', label: 'Machine ID' },
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'manufacturer', label: 'Manufacturer' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge value={row.status} />,
    },
    {
      key: 'installationDate',
      label: 'Installation Date',
      render: (row) =>
        row.installationDate
          ? new Date(row.installationDate).toLocaleDateString()
          : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/machines/edit/${row._id}`}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <FiEdit2 size={16} />
          </Link>
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
          <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
          <p className="text-gray-500 mt-1">Manage your machines and equipment</p>
        </div>
        <Link to="/machines/add" className="btn-primary flex items-center gap-2">
          <FiPlus size={18} />
          Add Machine
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by Machine ID..."
            />
          </div>
          <FilterDropdown
            label="Department"
            value={department}
            onChange={setDepartment}
            options={DEPARTMENT_OPTIONS}
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
          data={machines}
          loading={loading}
          emptyMessage="No machines found"
        />
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Machine"
        message={`Are you sure you want to delete ${selectedMachine?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedMachine(null);
        }}
      />
    </MainLayout>
  );
}
