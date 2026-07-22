'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@remotepay.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(true)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const dark = savedTheme === 'dark'
      setIsDark(dark)
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  // Toggle Light/Dark Mode
  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (email === 'admin@remotepay.com' && password === 'admin123') {
        localStorage.setItem('remote_pay_token', 'demo-jwt-token-xyz-12345')
        localStorage.setItem('remote_pay_user', JSON.stringify({ name: 'Javier Martínez', role: 'Admin' }))
        router.push('/employees')
      } else {
        setError('Credenciales inválidas. Usa la cuenta demo por defecto.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-150 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sun / Moon Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-md backdrop-blur-md transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95"
        title={isDark ? "Cambiar a Modo Claro (☀️)" : "Cambiar a Modo Oscuro (🌙)"}
      >
        {isDark ? (
          /* Sun Icon for Switching to Light */
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          /* Moon Icon for Switching to Dark */
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Background Decorative Gradients using Brand Color Tokens */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/15 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/30 mb-4">
            <svg className="w-8 h-8 text-white dark:text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Remote<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 font-medium">
            Concurrent Payroll Engine &amp; Global Admin Portal
          </p>
        </div>

        {/* Glassmorphism Card (Enhanced Contrast for Light Mode) */}
        <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-300/80 dark:border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-slate-300/60 dark:shadow-black/50 transition-colors duration-300">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-medium">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100/90 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                  placeholder="admin@remotepay.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100/90 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button using Brand Colors */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Demo Info Box */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs mb-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Credenciales de Demo SaaS
              </div>
              <p className="text-slate-700 dark:text-slate-400 text-xs font-medium">
                Email: <code className="text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-slate-950/80 px-1.5 py-0.5 rounded font-mono border border-emerald-200 dark:border-transparent">admin@remotepay.com</code>
              </p>
              <p className="text-slate-700 dark:text-slate-400 text-xs mt-1 font-medium">
                Password: <code className="text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-slate-950/80 px-1.5 py-0.5 rounded font-mono border border-emerald-200 dark:border-transparent">admin123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6 font-medium">
          Powered by Elixir 1.18.0 + Phoenix API &amp; Next.js 16
        </p>
      </div>
    </div>
  )
}
