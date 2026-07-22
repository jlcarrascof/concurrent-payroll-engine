import { useMutation, useQuery } from '@tanstack/react-query'
import { payrollApi } from '@/lib/api'
import { useState } from 'react'

export function usePayrollRun() {
  const [runId, setRunId] = useState<string | null>(null)

  const runMutation = useMutation({
    mutationFn: () => payrollApi.run().then((r) => r.data.data),
    onSuccess: (data) => setRunId(data.id),
  })

  const statusQuery = useQuery({
    queryKey: ['payroll-status', runId],
    queryFn: () => payrollApi.getStatus(runId!).then((r) => r.data.data),
    enabled: !!runId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'running' || status === 'pending' ? 2000 : false
    },
  })

  return {
    run: runMutation.mutate,
    isRunning: runMutation.isPending || statusQuery.data?.status === 'running',
    result: statusQuery.data,
    error: runMutation.error,
  }
}
