defmodule RemotePay.EmployeesTest do
  use RemotePay.DataCase

  alias RemotePay.Employees

  describe "employees" do
    alias RemotePay.Employees.Employee

    import RemotePay.EmployeesFixtures

    @invalid_attrs %{name: nil, currency: nil, email: nil, country: nil, salary: nil}

    test "list_employees/0 returns all employees" do
      employee = employee_fixture()
      assert Employees.list_employees() == [employee]
    end

    test "get_employee!/1 returns the employee with given id" do
      employee = employee_fixture()
      assert Employees.get_employee!(employee.id) == employee
    end

    test "create_employee/1 with valid data creates a employee" do
      valid_attrs = %{name: "some name", currency: "some currency", email: "some email", country: "some country", salary: "120.5"}

      assert {:ok, %Employee{} = employee} = Employees.create_employee(valid_attrs)
      assert employee.name == "some name"
      assert employee.currency == "some currency"
      assert employee.email == "some email"
      assert employee.country == "some country"
      assert employee.salary == Decimal.new("120.5")
    end

    test "create_employee/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Employees.create_employee(@invalid_attrs)
    end

    test "update_employee/2 with valid data updates the employee" do
      employee = employee_fixture()
      update_attrs = %{name: "some updated name", currency: "some updated currency", email: "some updated email", country: "some updated country", salary: "456.7"}

      assert {:ok, %Employee{} = employee} = Employees.update_employee(employee, update_attrs)
      assert employee.name == "some updated name"
      assert employee.currency == "some updated currency"
      assert employee.email == "some updated email"
      assert employee.country == "some updated country"
      assert employee.salary == Decimal.new("456.7")
    end

    test "update_employee/2 with invalid data returns error changeset" do
      employee = employee_fixture()
      assert {:error, %Ecto.Changeset{}} = Employees.update_employee(employee, @invalid_attrs)
      assert employee == Employees.get_employee!(employee.id)
    end

    test "delete_employee/1 deletes the employee" do
      employee = employee_fixture()
      assert {:ok, %Employee{}} = Employees.delete_employee(employee)
      assert_raise Ecto.NoResultsError, fn -> Employees.get_employee!(employee.id) end
    end

    test "change_employee/1 returns a employee changeset" do
      employee = employee_fixture()
      assert %Ecto.Changeset{} = Employees.change_employee(employee)
    end
  end
end
