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
  employee_name: string
  country: string
  gross_salary: number
  tax_rate: number
  tax_amount: number
  net_salary: number
  currency: string
}

export interface PayrollRun {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  total_employees: number
  total_gross: number
  total_net: number
  results: PayrollResult[]
  started_at: string
  completed_at: string | null
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
