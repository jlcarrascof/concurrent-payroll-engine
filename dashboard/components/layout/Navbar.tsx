'use client'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/employees': 'Employees',
  '/payroll': 'Run Payroll',
  '/health': 'System Health',
}

export function Navbar() {
  const path = usePathname()
  const title = PAGE_TITLES[path] || 'RemotePay Dashboard'

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 transition-colors">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          API Connected
        </span>
      </div>
    </header>
  )
}
