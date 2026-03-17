import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Transit Management System</h1>
        <p className="text-gray-500 text-lg">Select a module below to manage your transport network.</p>
      </div>

      {/* The Three Button Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        
        <Link href="/routes" className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:border-purple-500 hover:shadow-md transition text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">📍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Routes</h2>
          <p className="text-gray-500">Manage transit paths, schedules, and destinations.</p>
        </Link>

        <Link href="/categories" className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:blue-500 hover:shadow-md transition text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">🏷️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Categories</h2>
          <p className="text-gray-500">Classify your fleet into buses, trains, BRT, and more.</p>
        </Link>

        <Link href="/vehicles" className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:teal-500 hover:shadow-md transition text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">🚌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicles</h2>
          <p className="text-gray-500">Track individual vehicles and assign them to active routes.</p>
        </Link>

      </div>
    </div>
  );
}