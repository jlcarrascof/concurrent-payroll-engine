defmodule RemotePay.Employees do
  import Ecto.Query
  alias RemotePay.Repo
  alias RemotePay.Employees.Employee

  def list_employees(filters \\ %{}) do
    Employee
    |> filter_by_country(filters["country"])
    |> filter_by_currency(filters["currency"])
    |> filter_by_status(filters["status"] || "active")
    |> order_by(asc: :name)
    |> paginate(filters["page"], filters["per_page"])
    |> Repo.all()
  end

  def count_employees(filters \\ %{}) do
    Employee
    |> filter_by_country(filters["country"])
    |> filter_by_currency(filters["currency"])
    |> filter_by_status(filters["status"] || "active")
    |> Repo.aggregate(:count)
  end

  def get_employee!(id), do: Repo.get!(Employee, id)

  def create_employee(attrs \\ %{}) do
    %Employee{}
    |> Employee.changeset(attrs)
    |> Repo.insert()
  end

  def update_employee(%Employee{} = employee, attrs) do
    employee
    |> Employee.changeset(attrs)
    |> Repo.update()
  end

  def delete_employee(%Employee{} = employee) do
    Repo.delete(employee)
  end

  # ── Private filters ──────────────────────────────────────
  defp filter_by_country(query, nil), do: query
  defp filter_by_country(query, ""), do: query
  defp filter_by_country(query, country), do: where(query, country: ^country)

  defp filter_by_currency(query, nil), do: query
  defp filter_by_currency(query, ""), do: query
  defp filter_by_currency(query, currency), do: where(query, currency: ^currency)

  defp filter_by_status(query, status), do: where(query, status: ^status)

  defp paginate(query, page, per_page) do
    page = parse_int(page, 1)
    per_page = parse_int(per_page, 20)

    query
    |> limit(^per_page)
    |> offset(^((page - 1) * per_page))
  end

  defp parse_int(nil, default), do: default

  defp parse_int(val, default) when is_binary(val) do
    case Integer.parse(val) do
      {n, _} when n > 0 -> n
      _ -> default
    end
  end

  defp parse_int(val, _default) when is_integer(val), do: val
end
