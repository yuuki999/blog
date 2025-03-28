import Link from 'next/link';

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">u30c0u30c3u30b7u30e5u30dcu30fcu30c9</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* u8a18u4e8bu7ba1u7406u30abu30fcu30c9 */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">u8a18u4e8bu7ba1u7406</h2>
          <p className="text-gray-300 mb-6">u30d6u30edu30b0u8a18u4e8bu306eu4f5cu6210u3001u7de8u96c6u3001u524au9664u3092u884cu3044u307eu3059u3002</p>
          <div className="flex space-x-4">
            <Link 
              href="/dashboard/posts" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              u8a18u4e8bu4e00u89a7
            </Link>
            <Link 
              href="/dashboard/posts/new" 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              u65b0u898fu4f5cu6210
            </Link>
          </div>
        </div>
        
        {/* u30bfu30b0u7ba1u7406u30abu30fcu30c9 */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">u30bfu30b0u7ba1u7406</h2>
          <p className="text-gray-300 mb-6">u30d6u30edu30b0u8a18u4e8bu306eu30abu30c6u30b4u30eau30fcu5206u3051u306bu4f7fu7528u3059u308bu30bfu30b0u3092u7ba1u7406u3057u307eu3059u3002</p>
          <Link 
            href="/dashboard/tags" 
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            u30bfu30b0u7ba1u7406
          </Link>
        </div>
        
        {/* u30e1u30c7u30a3u30a2u7ba1u7406u30abu30fcu30c9 */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">u30e1u30c7u30a3u30a2u7ba1u7406</h2>
          <p className="text-gray-300 mb-6">u30d6u30edu30b0u8a18u4e8bu3067u4f7fu7528u3059u308bu753bu50cfu3084u30d5u30a1u30a4u30ebu3092u30a2u30c3u30d7u30edu30fcu30c9u3057u307eu3059u3002</p>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            u753bu50cfu30a2u30c3u30d7u30edu30fcu30c9
          </Link>
        </div>
        
        {/* u30d6u30edu30b0u30d7u30ecu30d3u30e5u30fcu30abu30fcu30c9 */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">u30d6u30edu30b0u30d7u30ecu30d3u30e5u30fc</h2>
          <p className="text-gray-300 mb-6">u516cu958bu3055u308cu3066u3044u308bu30d6u30edu30b0u8a18u4e8bu3092u78bau8a8du3057u307eu3059u3002</p>
          <Link 
            href="/blog" 
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            u30d6u30edu30b0u3092u8868u793a
          </Link>
        </div>
      </div>
    </div>
  );
}
