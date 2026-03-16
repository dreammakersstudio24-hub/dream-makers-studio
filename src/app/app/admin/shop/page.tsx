import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ShopAdminPage() {
  return (
    <div className="p-20 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Isolation Test Page</h1>
      <p className="text-neutral-400">If you can see this, the page is working and the crash was in the previous code logic/imports.</p>
      
      <div className="mt-8 p-6 bg-neutral-900 rounded-2xl border border-neutral-800">
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-2">System Info</h2>
        <ul className="text-xs space-y-2 text-neutral-500 font-mono">
          <li>Time: {new Date().toISOString()}</li>
          <li>Path: /app/admin/shop</li>
          <li>ENV Check (URL): {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING'}</li>
        </ul>
      </div>
      
      <a href="/app/dashboard" className="mt-8 inline-block px-6 py-3 bg-white text-black rounded-full font-bold">
        Back to Dashboard
      </a>
    </div>
  );
}
