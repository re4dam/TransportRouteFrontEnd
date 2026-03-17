export default function GlobalLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 mt-8 animate-pulse">
      
      {/* Skeleton Header Area */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="h-10 bg-gray-200 rounded-md w-64"></div>
        <div className="h-10 bg-purple-100 rounded-md w-36"></div>
      </div>

      {/* Skeleton Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b h-14 w-full"></div>
        
        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center px-6 py-4 h-16">
              <div className="h-4 bg-gray-200 rounded w-12 mr-8"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mr-auto"></div>
              <div className="h-6 bg-gray-100 rounded-full w-24 mr-8"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}