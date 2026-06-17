// Maps size prop values to Tailwind dimension classes
const sizes = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

// Shows a spinning loader while content is being fetched
export default function LoadingSpinner({ size = 'md' }) {
  // Get the correct size class, fall back to md if unknown
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className="flex justify-center items-center py-8">
      {/* Spinning circle with a colored top border to create the spin effect */}
      <div className={`animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 ${sizeClass}`} />
    </div>
  );
}
