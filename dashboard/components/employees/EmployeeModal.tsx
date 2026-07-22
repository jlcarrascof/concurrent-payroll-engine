'use client'
import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees'
import type { Employee } from '@/lib/types'

interface Props {
  open: boolean
  employee: Employee | null
  onClose: () => void
}

const COUNTRIES = ['Argentina', 'Brasil', 'Colombia', 'México', 'España', 'USA']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'ARS', 'BRL']

export function EmployeeModal({ open, employee, onClose }: Props) {
  const isEditing = !!employee
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<{
    name: string
    email: string
    country: string
    currency: Employee['currency']
    salary: number
  }>({
    name: '',
    email: '',
    country: '',
    currency: 'USD',
    salary: 0,
  })

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        country: employee.country,
        currency: employee.currency,
        salary: employee.salary,
      })
    } else {
      setForm({ name: '', email: '', country: '', currency: 'USD', salary: 0 })
    }
  }, [employee, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: employee!.id, data: form })
      } else {
        await createMutation.mutateAsync(form)
      }
      onClose()
    } catch {
      // error handled by the hook
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Employee' : 'New Employee'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div>
          <label className="form-label">Country</label>
          <select
            required
            className="form-input"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Salary"
            type="number"
            required
            value={form.salary || ''}
            onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
          />
          <div>
            <label className="form-label">Currency</label>
            <select
              className="form-input"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value as Employee['currency'] })}
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
