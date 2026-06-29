defmodule RemotePay.Payroll do
  alias RemotePay.{Repo, Employees}
  alias RemotePay.Payroll.CountryRules
  import Ecto.Query

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

    # 2. THE MAGIC: Concurrent processing using Task.async_stream
    results =
      employees
      |> Task.async_stream(&calculate_employee_payroll/1, max_concurrency: 10, timeout: 5_000)
      |> Enum.map(fn {:ok, result} -> result end)

    # 3. Sum total payout
    total_net =
      Enum.reduce(results, Decimal.new(0), fn r, acc -> Decimal.add(acc, r.net_salary) end)

    # 4. Save the "receipt" in the database
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
  end
end
