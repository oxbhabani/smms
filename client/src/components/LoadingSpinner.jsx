const sizes = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function LoadingSpinner({ size = 'md' }) {
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className="flex justify-center items-center py-8">
      <div className={`animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 ${sizeClass}`} />
    </div>
  );
}
