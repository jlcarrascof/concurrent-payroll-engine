defmodule RemotePayWeb.PayrollController do
  use RemotePayWeb, :controller
  alias RemotePay.Payroll

  # 1. The waiter receives the order to run the payroll
  def run(conn, _params) do
    # Call the newly built engine
    case Payroll.run_payroll() do
      {:ok, result} ->
        # If successful, serve the tray (JSON)
        json(conn, %{
          data: %{
            run_id: result.run_id,
            total_employees: result.total_employees,
            total_net_payout: result.total_net_payout,
            results: Enum.map(result.results, &serialize_result/1)
          }
        })
    end
  end

  # 2. The waiter searches for an old receipt in the archives
  def status(conn, %{"id" => id}) do
    run = Payroll.get_run!(id)

    json(conn, %{
      data: %{
        id: run.id,
        status: run.status,
        total_employees: run.total_employees,
        total_net_payout: run.total_net_payout,
        ran_at: run.ran_at
      }
    })
  end

  # Private function to nicely format each employee in the final JSON

  defp serialize_result(r) do
    %{
      employee_id: r.employee_id,
      name: r.name,
      country: r.country,
      gross_salary: r.gross_salary,
      tax_rate: r.tax_rate,
      tax_amount: r.tax_amount,
      net_salary: r.net_salary,
      currency: r.currency
    }
  end
end
