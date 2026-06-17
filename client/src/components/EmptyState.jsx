import { FiInbox } from 'react-icons/fi';

// Displays a centered placeholder when there is no data to show
export default function EmptyState({ message = 'No data found', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <div className="text-5xl mb-4">
        {/* Show the custom icon if provided, otherwise default to inbox icon */}
        {Icon ? <Icon /> : <FiInbox />}
      </div>
      <p className="text-lg">{message}</p>
    </div>
  );
}
