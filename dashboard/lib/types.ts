export interface Employee {
  id: number
  name: string
  email: string
  country: string
  salary: number
  currency: 'USD' | 'EUR' | 'GBP' | 'ARS' | 'BRL'
  status: 'active' | 'inactive'
  inserted_at: string
  updated_at: string
}

export interface PayrollResult {
  employee_id: number
  name?: string
  employee_name?: string
  country: string
  gross_salary: string | number
  tax_rate: number
  tax_amount: string | number
  net_salary: string | number
  currency: string
}

export interface PayrollRun {
  run_id?: number | string
  id?: string
  status?: 'pending' | 'running' | 'completed' | 'failed'
  total_employees: number
  total_gross?: number | string
  total_net?: number | string
  total_net_payout?: number | string
  results: PayrollResult[]
  started_at?: string
  completed_at?: string | null
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down'
  timestamp: string
  version: string
  database: 'connected' | 'disconnected'
  uptime_seconds: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    total: number
    page: number
    per_page: number
    total_pages?: number
  }
  page?: number
  per_page?: number
  total?: number
  total_pages?: number
}

export interface EmployeeFilters {
  country?: string
  currency?: string
  page?: number
  per_page?: number
}
