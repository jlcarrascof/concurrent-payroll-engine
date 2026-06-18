defmodule RemotePayWeb.EmployeeController do
  use RemotePayWeb, :controller
  alias RemotePay.Employees
  alias RemotePay.Employees.Employee

  def index(conn, params) do
    employees = Employees.list_employees(params)
    total = Employees.count_employees(params)

    json(conn, %{
      data: Enum.map(employees, &serialize/1),
      meta: %{
        total: total,
        page: String.to_integer(params["page"] || "1"),
        per_page: String.to_integer(params["per_page"] || "20")
      }
    })
  end

  def show(conn, %{"id" => id}) do
    employee = Employees.get_employee!(id)
    json(conn, %{data: serialize(employee)})
  end

  def create(conn, %{"employee" => employee_params}) do
    # Here the waiter goes to the kitchen. Did it go well or bad?
    case Employees.create_employee(employee_params) do
      # If it went well (Tuple :ok)
      {:ok, employee} ->
        conn
        |> put_status(:created)
        |> json(%{data: serialize(employee)})

      # If there was a validation error (Tuple :error)
      {:error, changeset} ->
        conn
        # Status 422 Unprocessable Entity
        |> put_status(:unprocessable_entity)
        |> json(%{errors: format_errors(changeset)})
    end
  end

  def update(conn, %{"id" => id, "employee" => employee_params}) do
    employee = Employees.get_employee!(id)

    case Employees.update_employee(employee, employee_params) do
      {:ok, employee} ->
        json(conn, %{data: serialize(employee)})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: format_errors(changeset)})
    end
  end

  def delete(conn, %{"id" => id}) do
    employee = Employees.get_employee!(id)
    {:ok, _} = Employees.delete_employee(employee)
    send_resp(conn, :no_content, "")
  end

  # Private function to format the JSON response (The plating)
  defp serialize(%Employee{} = e) do
    %{
      id: e.id,
      name: e.name,
      email: e.email,
      country: e.country,
      salary: e.salary,
      currency: e.currency,
      status: e.status,
      inserted_at: e.inserted_at,
      updated_at: e.updated_at
    }
  end

  # Function to translate complex database errors to readable text
  defp format_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {k, v}, acc ->
        String.replace(acc, "%{#{k}}", to_string(v))
      end)
    end)
  end
end
