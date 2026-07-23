import axios from 'axios'
import type {
  Employee, PayrollRun, HealthStatus,
  PaginatedResponse, EmployeeFilters
} from './types'

const api = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.status, error.config?.url)
    return Promise.reject(error)
  }
)

export const employeesApi = {
  list: (filters: EmployeeFilters = {}) =>
    api.get<PaginatedResponse<Employee>>('/api/employees', { params: filters }),

  get: (id: number) =>
    api.get<{ data: Employee }>(`/api/employees/${id}`),

  create: (data: Partial<Employee>) =>
    api.post<{ data: Employee }>('/api/employees', { employee: data }),

  update: (id: number, data: Partial<Employee>) =>
    api.put<{ data: Employee }>(`/api/employees/${id}`, { employee: data }),

  delete: (id: number) =>
    api.delete(`/api/employees/${id}`),
}

export const payrollApi = {
  run: () =>
    api.post<{ data: PayrollRun }>('/api/payroll/run'),

  getStatus: (id: string) =>
    api.get<{ data: PayrollRun }>(`/api/payroll/${id}/status`),
}

export const healthApi = {
  check: () =>
    api.get<HealthStatus>('/api/health'),
}
