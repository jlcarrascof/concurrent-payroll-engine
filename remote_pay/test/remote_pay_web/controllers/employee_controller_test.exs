defmodule RemotePayWeb.EmployeeControllerTest do
  use RemotePayWeb.ConnCase
  alias RemotePay.Employees

  @valid_attrs %{
    name: "Test User",
    email: "test@example.com",
    country: "Argentina",
    salary: 5000,
    currency: "USD"
  }

  describe "GET /api/employees" do
    test "returns 200 with list of employees", %{conn: conn} do
      {:ok, _} = Employees.create_employee(@valid_attrs)
      conn = get(conn, ~p"/api/employees")
      assert %{"data" => [_employee]} = json_response(conn, 200)
    end
  end

  describe "POST /api/employees" do
    test "creates employee with valid data returning 201", %{conn: conn} do
      conn = post(conn, ~p"/api/employees", employee: @valid_attrs)
      assert %{"data" => %{"id" => _id}} = json_response(conn, 201)
    end

    test "invalid data returns 422", %{conn: conn} do
      conn = post(conn, ~p"/api/employees", employee: %{name: ""})
      assert %{"errors" => _errors} = json_response(conn, 422)
    end
  end
end
