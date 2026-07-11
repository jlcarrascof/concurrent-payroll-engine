defmodule RemotePay.EmployeesTest do
  use RemotePay.DataCase
  alias RemotePay.Employees

  @valid_attrs %{
    name: "Test User",
    email: "test@example.com",
    country: "Argentina",
    salary: 5000,
    currency: "USD"
  }

  describe "create_employee/1" do
    test "creates an employee with valid data" do
      assert {:ok, employee} = Employees.create_employee(@valid_attrs)
      assert employee.name == "Test User"
      assert employee.status == "active"
    end

    test "fails with duplicate email" do
      {:ok, _} = Employees.create_employee(@valid_attrs)
      assert {:error, changeset} = Employees.create_employee(@valid_attrs)
      assert "has already been taken" in errors_on(changeset).email
    end

    test "fails with negative salary" do
      attrs = Map.put(@valid_attrs, :salary, -100)
      assert {:error, changeset} = Employees.create_employee(attrs)
      assert "must be greater than 0" in errors_on(changeset).salary
    end

    test "fails with unauthorized currency" do
      attrs = Map.put(@valid_attrs, :currency, "XYZ")
      assert {:error, changeset} = Employees.create_employee(attrs)
      assert errors_on(changeset).currency
    end

    test "fails without name (required field)" do
      attrs = Map.delete(@valid_attrs, :name)
      assert {:error, changeset} = Employees.create_employee(attrs)
      assert "can't be blank" in errors_on(changeset).name
    end

    test "fails with invalid email format" do
      attrs = Map.put(@valid_attrs, :email, "no-es-un-email")
      assert {:error, changeset} = Employees.create_employee(attrs)
      assert errors_on(changeset).email
    end
  end

  describe "list_employees/1" do
    setup do
      {:ok, _} = Employees.create_employee(@valid_attrs)

      {:ok, _} =
        Employees.create_employee(%{
          @valid_attrs
          | email: "other@example.com",
            country: "Colombia"
        })

      :ok
    end

    test "filters by country correctly" do
      results = Employees.list_employees(%{"country" => "Colombia"})
      assert length(results) == 1
      assert hd(results).country == "Colombia"
    end

    test "lists only active employees by default" do
      results = Employees.list_employees(%{})
      assert length(results) == 2
    end

    test "paginates results correctly" do
      Enum.each(1..25, fn i ->
        Employees.create_employee(%{
          name: "Emp #{i}",
          email: "emp#{i}@test.com",
          country: "Argentina",
          salary: 1000,
          currency: "USD"
        })
      end)

      page1 = Employees.list_employees(%{"page" => "1", "per_page" => "10"})
      page2 = Employees.list_employees(%{"page" => "2", "per_page" => "10"})

      assert length(page1) == 10
      assert length(page2) == 10
      assert hd(page1).id != hd(page2).id
    end
  end
end
