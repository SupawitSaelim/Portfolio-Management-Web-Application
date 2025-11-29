export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Portfolio Manager
          </h1>
          <p className="text-gray-600">
            Manage your investments with ease
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">✅ Firebase Connected!</p>
            <p className="text-green-700 text-sm mt-1">
              Your project is ready. Authentication will be added next.
            </p>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>Next steps:</p>
            <ul className="mt-2 space-y-1 text-left list-disc list-inside">
              <li>Run: npm install</li>
              <li>Run: npm run dev</li>
              <li>Build authentication system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
