defmodule RemotePayWeb.EmployeeJSON do
  alias RemotePay.Employees.Employee

  @doc """
  Renders a list of employees.
  """
  def index(%{employees: employees}) do
    %{data: for(employee <- employees, do: data(employee))}
  end

  @doc """
  Renders a single employee.
  """
  def show(%{employee: employee}) do
    %{data: data(employee)}
  end

  defp data(%Employee{} = employee) do
    %{
      id: employee.id,
      name: employee.name,
      email: employee.email,
      country: employee.country,
      salary: employee.salary,
      currency: employee.currency
    }
  end
end
