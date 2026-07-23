'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/employees', label: 'Employees', icon: '👥' },
  { href: '/payroll', label: 'Run Payroll', icon: '⚡' },
  { href: '/health', label: 'System Health', icon: '🩺' },
]

export function Sidebar() {
  const path = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('remote_pay_token')
    localStorage.removeItem('remote_pay_user')
    router.push('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-slate-950 dark:bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 transition-colors duration-300">
      
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-violet-500/25">
          RP
        </div>
        <div>
          <p className="text-white font-extrabold text-sm tracking-tight leading-none">Remote<span className="text-violet-400">Pay</span></p>
          <p className="text-purple-300 font-semibold text-[11px] mt-1 tracking-wide">Payroll Engine</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-6 space-y-1.5">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Main Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive = path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/90 dark:bg-slate-950/80 border border-slate-800 space-y-2">
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Engine Stack</p>
          <p className="text-slate-200 text-xs font-mono font-semibold mt-0.5">Elixir 1.18 + Phoenix</p>
          <p className="text-violet-400 text-xs font-mono font-medium">Minikube + K8s</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800/90 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-bold border border-slate-700/80 hover:border-red-500/40 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
