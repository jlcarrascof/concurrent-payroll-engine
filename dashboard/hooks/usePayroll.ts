import { useMutation } from '@tanstack/react-query'
import { payrollApi } from '@/lib/api'
import { useState } from 'react'
import type { PayrollRun } from '@/lib/types'

export function usePayrollRun() {
  const [result, setResult] = useState<PayrollRun | null>(null)

  const runMutation = useMutation({
    mutationFn: async () => {
      const response = await payrollApi.run()
      const data = response.data.data
      
      // Calculate total gross from results
      const totalGross = data.results.reduce(
        (sum: number, r: { gross_salary: string | number }) => sum + Number(r.gross_salary),
        0
      )

      const formatted: PayrollRun = {
        run_id: data.run_id,
        id: String(data.run_id || '1'),
        status: 'completed',
        total_employees: data.total_employees || data.results.length,
        total_gross: totalGross,
        total_net: data.total_net_payout || data.total_net || 0,
        results: data.results.map((r: { name?: string; employee_name?: string; [key: string]: unknown }) => ({
          ...r,
          employee_name: r.employee_name || r.name || 'Employee',
        })) as PayrollRun['results'],
      }

      setResult(formatted)
      return formatted
    },
  })

  return {
    run: runMutation.mutate,
    isRunning: runMutation.isPending,
    result,
    error: runMutation.error,
  }
}
