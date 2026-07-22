'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/employees': 'Employees Management',
  '/payroll': 'Run Concurrent Payroll',
  '/health': 'System Health & Infrastructure',
}

export function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const title = PAGE_TITLES[path] || 'RemotePay Dashboard'
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    // Load theme setting
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const isDark = savedTheme === 'dark'
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      document.documentElement.classList.add('dark')
    }

    // Load user info
    const savedUser = localStorage.getItem('remote_pay_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        setUser({ name: 'Javier Martínez', role: 'Admin' })
      }
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDarkMode
    setIsDarkMode(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('remote_pay_token')
    localStorage.removeItem('remote_pay_user')
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between px-6 transition-colors duration-300 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
      
      <div className="flex items-center gap-4">
        {/* API Status Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          API Connected
        </span>

        {/* Dark / Light Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95"
          title={isDarkMode ? "Switch to Light Mode (☀️)" : "Switch to Dark Mode (🌙)"}
        >
          {isDarkMode ? (
            <svg className="w-4.5 h-4.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* User Info & Logout Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name || 'Javier Martínez'}</p>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{user?.role || 'Admin'}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 active:scale-95"
            title="Log Out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
