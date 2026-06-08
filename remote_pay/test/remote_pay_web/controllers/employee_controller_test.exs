defmodule RemotePayWeb.EmployeeControllerTest do
  use RemotePayWeb.ConnCase

  import RemotePay.EmployeesFixtures
  alias RemotePay.Employees.Employee

  @create_attrs %{
    name: "some name",
    currency: "some currency",
    email: "some email",
    country: "some country",
    salary: "120.5"
  }
  @update_attrs %{
    name: "some updated name",
    currency: "some updated currency",
    email: "some updated email",
    country: "some updated country",
    salary: "456.7"
  }
  @invalid_attrs %{name: nil, currency: nil, email: nil, country: nil, salary: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all employees", %{conn: conn} do
      conn = get(conn, ~p"/api/employees")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create employee" do
    test "renders employee when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/employees", employee: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/employees/#{id}")

      assert %{
               "id" => ^id,
               "country" => "some country",
               "currency" => "some currency",
               "email" => "some email",
               "name" => "some name",
               "salary" => "120.5"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/employees", employee: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update employee" do
    setup [:create_employee]

    test "renders employee when data is valid", %{conn: conn, employee: %Employee{id: id} = employee} do
      conn = put(conn, ~p"/api/employees/#{employee}", employee: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/employees/#{id}")

      assert %{
               "id" => ^id,
               "country" => "some updated country",
               "currency" => "some updated currency",
               "email" => "some updated email",
               "name" => "some updated name",
               "salary" => "456.7"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, employee: employee} do
      conn = put(conn, ~p"/api/employees/#{employee}", employee: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete employee" do
    setup [:create_employee]

    test "deletes chosen employee", %{conn: conn, employee: employee} do
      conn = delete(conn, ~p"/api/employees/#{employee}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/employees/#{employee}")
      end
    end
  end

  defp create_employee(_) do
    employee = employee_fixture()

    %{employee: employee}
  end
end
