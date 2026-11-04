function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-rose-50 to-orange-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
