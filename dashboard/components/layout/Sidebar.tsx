'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/employees', label: 'Employees', icon: '👥' },
  { href: '/payroll', label: 'Run Payroll', icon: '⚡' },
  { href: '/health', label: 'System Health', icon: '🩺' },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-slate-900 flex flex-col shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
          RP
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">RemotePay</p>
          <p className="text-brand-400 text-xs mt-0.5">Payroll Engine</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800 space-y-1">
        <p className="text-slate-500 text-xs">Powered by</p>
        <p className="text-slate-300 text-xs font-mono">Elixir + Phoenix 1.8</p>
        <p className="text-slate-500 text-xs font-mono">Minikube + K8s</p>
      </div>
    </aside>
  )
}
