defmodule RemotePay.Payroll do
  alias RemotePay.{Repo, Employees}
  alias RemotePay.Payroll.CountryRules

  defmodule PayrollRun do
    use Ecto.Schema

    schema "payroll_runs" do
      field(:status, :string)
      field(:total_employees, :integer)
      field(:total_net_payout, :decimal)
      field(:currency, :string)
      field(:results, :map)
      field(:ran_at, :utc_datetime)
      timestamps()
    end
  end

  def run_payroll do
    # 1. Fetch only active employees
    employees = Employees.list_employees(%{"status" => "active"})

    # 2. KEY: Concurrent processing using Task.async_stream
    results =
      employees
      |> Task.async_stream(&calculate_employee_payroll/1, max_concurrency: 10, timeout: 5_000)
      |> Enum.map(fn {:ok, result} -> result end)

    # 3. Sum total payout
    total_net =
      Enum.reduce(results, Decimal.new(0), fn r, acc -> Decimal.add(acc, r.net_salary) end)

    # 4. Save the receipt in the database
    {:ok, run} =
      %PayrollRun{}
      |> Ecto.Changeset.change(%{
        status: "completed",
        total_employees: length(results),
        total_net_payout: total_net,
        currency: "USD",
        results: %{"employees" => Enum.map(results, &stringify_keys/1)},
        ran_at: DateTime.utc_now() |> DateTime.truncate(:second)
      })
      |> Repo.insert()

    {:ok,
     %{
       run_id: run.id,
       total_employees: length(results),
       total_net_payout: total_net,
       results: results
     }}
  end

  def get_run!(id), do: Repo.get!(PayrollRun, id)
  # Private function called by each concurrent worker

  defp calculate_employee_payroll(employee) do
    net = CountryRules.calculate_net(employee)
    tax_rate = CountryRules.tax_rate(employee)
    tax_amount = Decimal.sub(employee.salary, net)

    %{
      employee_id: employee.id,
      name: employee.name,
      country: employee.country,
      gross_salary: employee.salary,
      tax_rate: tax_rate,
      tax_amount: tax_amount,
      net_salary: net,
      currency: employee.currency
    }
  end

  # JSON requires string keys instead of atoms
  defp stringify_keys(map) do
    Map.new(map, fn {k, v} -> {to_string(k), v} end)
  end
end
