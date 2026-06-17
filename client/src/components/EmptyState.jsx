import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ message = 'No data found', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <div className="text-5xl mb-4">
        {Icon ? <Icon /> : <FiInbox />}
      </div>
      <p className="text-lg">{message}</p>
    </div>
  );
}
