import { logout } from "@/actions/auth"
import { LayoutDashboard, Image as ImageIcon, FileText, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-neutral-900/50 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-light tracking-wide uppercase">D.M. Studio</Link>
          <span className="block text-xs tracking-widest text-neutral-500 mt-1 uppercase">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium tracking-wide text-neutral-300 hover:text-white">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium tracking-wide text-neutral-300 hover:text-white">
            <ImageIcon className="w-4 h-4" /> Gallery
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 text-sm font-medium tracking-wide cursor-not-allowed">
            <FileText className="w-4 h-4" /> E-Books (Coming Soon)
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm font-medium tracking-wide text-neutral-400">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
