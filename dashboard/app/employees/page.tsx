'use client'
import { useState } from 'react'
import { useEmployees, useDeleteEmployee } from '@/hooks/useEmployees'
import { EmployeeModal } from '@/components/employees/EmployeeModal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Employee, EmployeeFilters } from '@/lib/types'

const COUNTRIES = ['Argentina', 'Brasil', 'Colombia', 'México', 'España', 'USA']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'ARS', 'BRL']

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, per_page: 10 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const { data, isLoading } = useEmployees(filters)
  const deleteMutation = useDeleteEmployee()

  function handleEdit(emp: Employee) {
    setEditEmployee(emp)
    setModalOpen(true)
  }

  function handleNew() {
    setEditEmployee(null)
    setModalOpen(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Employees</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {data?.total ?? 0} registered employees
          </p>
        </div>
        <Button onClick={handleNew}>+ New Employee</Button>
      </div>

      <div className="card p-4 flex gap-3 flex-wrap">
        <select
          className="form-input w-40"
          value={filters.country ?? ''}
          onChange={(e) => setFilters({ ...filters, country: e.target.value || undefined, page: 1 })}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          className="form-input w-36"
          value={filters.currency ?? ''}
          onChange={(e) => setFilters({ ...filters, currency: e.target.value || undefined, page: 1 })}
        >
          <option value="">All currencies</option>
          {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Button variant="secondary" onClick={() => setFilters({ page: 1, per_page: 10 })}>
          Clear filters
        </Button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
              {['Name', 'Email', 'Country', 'Salary', 'Currency', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.data.map((emp) => (
              <tr key={emp.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-medium">{emp.name}</td>
                <td className="px-4 py-3 text-slate-500">{emp.email}</td>
                <td className="px-4 py-3">{emp.country}</td>
                <td className="px-4 py-3 font-mono font-medium">{emp.salary.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant="active">{emp.currency}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={emp.status === 'active' ? 'active' : 'inactive'}>{emp.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-xs text-brand-600 hover:text-brand-700 font-medium" onClick={() => handleEdit(emp)}>
                      Edit
                    </button>
                    <button className="text-xs text-red-500 hover:text-red-600 font-medium" onClick={() => deleteMutation.mutate(emp.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {filters.page} of {data?.total_pages ?? 1}
          </span>
          <div className="flex gap-2">
            <button
              className="btn-secondary text-xs py-1 px-3"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
            >
              ← Previous
            </button>
            <button
              className="btn-secondary text-xs py-1 px-3"
              disabled={(filters.page ?? 1) >= (data?.total_pages ?? 1)}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <EmployeeModal open={modalOpen} employee={editEmployee} onClose={() => setModalOpen(false)} />
    </div>
  )
}
