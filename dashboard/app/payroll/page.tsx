'use client'

import { usePayrollRun } from '@/hooks/usePayroll'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function PayrollPage() {
  const { run, isRunning, result } = usePayrollRun()

  function exportCsv() {
    if (!result?.results) return
    const rows = [
      ['Employee', 'Country', 'Gross Salary', 'Tax %', 'Tax Amount', 'Net Salary', 'Currency'],
      ...result.results.map((r) => [
        r.employee_name || r.name,
        r.country,
        r.gross_salary,
        r.tax_rate,
        r.tax_amount,
        r.net_salary,
        r.currency,
      ]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payroll_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatNumber = (val?: string | number) => {
    if (val === undefined || val === null) return '0'
    const num = typeof val === 'string' ? parseFloat(val) : val
    return isNaN(num) ? '0' : num.toLocaleString()
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Run Payroll</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Execute the concurrent payroll engine with Elixir OTP Task.async_stream
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Concurrent Payroll Engine</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Processes all active employees in parallel, calculating gross salary,
              country-specific taxes, and net salary.
            </p>
            <div className="flex gap-4 mt-3">
              <span className="text-xs text-slate-500">
                <code className="text-violet-600 dark:text-violet-400 font-mono bg-violet-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-violet-200 dark:border-slate-700">Task.async_stream/3</code>
                {' — '}native Elixir concurrency
              </span>
              <span className="text-xs text-slate-500">Configurable country tax rules</span>
            </div>
          </div>
          <Button size="lg" onClick={() => run()} disabled={isRunning}>
            {isRunning ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Processing...</>
            ) : (
              '⚡ Run Payroll'
            )}
          </Button>
        </div>

        {isRunning && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>Processing active employees in parallel...</span>
              <span>Running</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full animate-pulse w-3/4 shadow-sm shadow-violet-500" />
            </div>
          </div>
        )}
      </div>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Employees processed</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{result.total_employees}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total gross</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">${formatNumber(result.total_gross)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total net payout</p>
              <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">${formatNumber(result.total_net)}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Run results</h3>
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                📥 Export CSV
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left bg-slate-50/50 dark:bg-slate-900/50">
                  {['Employee', 'Country', 'Gross', 'Tax %', 'Tax Amount', 'Net', 'Currency'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.results.map((r) => (
                  <tr key={r.employee_id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{r.employee_name || r.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">{r.country}</td>
                    <td className="px-5 py-3.5 font-mono font-medium">${formatNumber(r.gross_salary)}</td>
                    <td className="px-5 py-3.5 text-slate-500 font-medium">{r.tax_rate}%</td>
                    <td className="px-5 py-3.5 font-mono text-red-600 dark:text-red-400 font-medium">-${formatNumber(r.tax_amount)}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-violet-600 dark:text-violet-400">${formatNumber(r.net_salary)}</td>
                    <td className="px-5 py-3.5"><Badge variant="active">{r.currency}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
