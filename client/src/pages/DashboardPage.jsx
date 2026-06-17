import { FiTool, FiAlertTriangle, FiClipboard, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { useFetch } from '../hooks/useFetch';
import { getDashboardStats } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Dashboard — shows overview stats for machines, work orders, and maintenance
export default function DashboardPage() {
  const { data: stats, loading } = useFetch(() => getDashboardStats());

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  // Map stats into card configs — each card shows a label, number, icon, and color
  const cards = [
    { title: 'Total Machines', value: stats?.totalMachines ?? 0, icon: FiTool, color: 'bg-indigo-500' },
    { title: 'Under Maintenance', value: stats?.underMaintenance ?? 0, icon: FiTool, color: 'bg-yellow-500' },
    { title: 'Breakdown', value: stats?.breakdown ?? 0, icon: FiAlertTriangle, color: 'bg-red-500' },
    { title: 'Open Work Orders', value: stats?.openWorkOrders ?? 0, icon: FiClipboard, color: 'bg-blue-500' },
    { title: 'In Progress', value: stats?.inProgress ?? 0, icon: FiClipboard, color: 'bg-indigo-500' },
    { title: 'Completed', value: stats?.completed ?? 0, icon: FiCheckCircle, color: 'bg-green-500' },
    { title: 'Upcoming Maintenance', value: stats?.upcomingMaintenance ?? 0, icon: FiCalendar, color: 'bg-purple-500' },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your maintenance system</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </MainLayout>
  );
}
