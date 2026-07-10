defmodule RemotePayWeb.PayrollControllerTest do
  use RemotePayWeb.ConnCase
  alias RemotePay.Employees

  setup do
    {:ok, _} =
      Employees.create_employee(%{
        name: "Test User",
        email: "test@example.com",
        country: "Argentina",
        salary: 1000,
        currency: "USD"
      })

    :ok
  end

  test "POST /api/payroll/run ejecuta el motor y retorna resultados", %{conn: conn} do
    conn = post(conn, ~p"/api/payroll/run")

    assert %{"data" => data} = json_response(conn, 200)
    assert data["total_employees"] == 1
    assert [result] = data["results"]
    assert result["country"] == "Argentina"
  end

  test "GET /api/payroll/:id/status retorna el estado de una corrida", %{conn: conn} do
    conn = post(conn, ~p"/api/payroll/run")
    %{"data" => %{"run_id" => run_id}} = json_response(conn, 200)

    conn = get(build_conn(), ~p"/api/payroll/#{run_id}/status")
    assert %{"data" => %{"status" => "completed"}} = json_response(conn, 200)
  end
end
