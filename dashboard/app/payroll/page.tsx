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
        r.employee_name, r.country,
        r.gross_salary, r.tax_rate,
        r.tax_amount, r.net_salary, r.currency,
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Run Payroll</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Execute the concurrent payroll engine with Task.async_stream
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Payroll Engine</h2>
            <p className="text-sm text-slate-500 mt-1">
              Processes all active employees in parallel, calculating gross salary,
              country-specific taxes, and net salary.
            </p>
            <div className="flex gap-4 mt-3">
              <span className="text-xs text-slate-500">
                <code className="text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Task.async_stream/3</code>
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
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Processing employees...</span>
              <span>{result?.status ?? 'running'}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}
      </div>

      {result?.status === 'completed' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-xs text-slate-500 mb-1">Employees processed</p>
              <p className="text-2xl font-semibold">{result.total_employees}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-slate-500 mb-1">Total gross</p>
              <p className="text-2xl font-semibold">${result.total_gross.toLocaleString()}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-slate-500 mb-1">Total net</p>
              <p className="text-2xl font-semibold text-brand-600">${result.total_net.toLocaleString()}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold">Run results</h3>
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                📥 Export CSV
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                  {['Employee', 'Country', 'Gross', 'Tax %', 'Tax Amount', 'Net', 'Currency'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.results.map((r) => (
                  <tr key={r.employee_id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-medium">{r.employee_name}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{r.country}</td>
                    <td className="px-4 py-2.5 font-mono">{r.gross_salary.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-slate-500">{r.tax_rate}%</td>
                    <td className="px-4 py-2.5 font-mono text-red-600">-{r.tax_amount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-brand-600">{r.net_salary.toLocaleString()}</td>
                    <td className="px-4 py-2.5"><Badge variant="active">{r.currency}</Badge></td>
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
