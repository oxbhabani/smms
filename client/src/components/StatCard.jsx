export default function StatCard({ title, value, icon: Icon, color = 'bg-indigo-500' }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow p-5">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${color} text-white`}>
        {Icon && <Icon className="text-xl" />}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
