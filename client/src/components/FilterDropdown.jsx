// Dropdown select for filtering data by a category
export default function FilterDropdown({ value, onChange, options = [], label }) {
  return (
    <div className="flex items-center gap-2">
      {/* Show an optional label to the left of the dropdown */}
      {label && <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
