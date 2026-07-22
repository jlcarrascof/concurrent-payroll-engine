'use client'
import { useHealth } from '@/hooks/useHealth'

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

export default function HealthPage() {
  const { data, isLoading, isError, dataUpdatedAt } = useHealth()
  const isOk = data?.status === 'ok'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">System Health</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time monitoring — refreshes every 30 seconds
          </p>
        </div>
        {dataUpdatedAt > 0 && (
          <span className="text-xs text-slate-400">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className={`card p-6 border-l-4 ${isOk ? 'border-l-green-500' : 'border-l-red-500'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isOk ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {isLoading ? '⏳' : isError ? '❌' : isOk ? '✅' : '⚠️'}
          </div>
          <div>
            <p className={`text-lg font-semibold ${isOk ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isLoading ? 'Checking...' : isOk ? 'All systems operational' : 'System issues detected'}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              API Elixir + Phoenix — v{data?.version ?? '—'} — Minikube + K8s
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">API Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOk ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${isOk ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {data?.status ?? '—'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">/api/health</p>
        </div>

        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Database</p>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${data?.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {data?.database ?? '—'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">PostgreSQL</p>
        </div>

        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Uptime</p>
          <p className="text-2xl font-semibold">
            {data ? formatUptime(data.uptime_seconds) : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">since last restart</p>
        </div>

        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Version</p>
          <p className="text-2xl font-semibold font-mono">
            {data?.version ?? '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">RemotePay API</p>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Production Stack</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {[
            ['Backend', 'Elixir 1.18 + Phoenix 1.8'],
            ['Database', 'PostgreSQL 15'],
            ['Deploy', 'Docker · Minikube + K8s'],
            ['CI/CD', 'GitHub Actions'],
            ['Frontend', 'Next.js 16 · Vercel'],
            ['Concurrency', 'Task.async_stream (OTP)'],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="text-slate-400 w-32 shrink-0">{label}</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
