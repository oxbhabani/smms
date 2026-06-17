// Wraps login/register pages with a centered card layout and app branding

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">SMMS</h1>
          <p className="text-gray-500 mt-2">Smart Maintenance Management System</p>
        </div>
        <div className="card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
