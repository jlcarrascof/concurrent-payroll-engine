defmodule RemotePay.PayrollTest do
  use RemotePay.DataCase
  alias RemotePay.{Employees, Payroll}

  test "calculates correctly for Argentina (20% withholding)" do
    # Create a fake active employee from Argentina
    {:ok, _} =
      Employees.create_employee(%{
        name: "Test AR",
        email: "ar@test.com",
        country: "Argentina",
        salary: 1000,
        currency: "USD"
      })

    # Run the concurrent engine
    {:ok, result} = Payroll.run_payroll()

    # Find our guy in the massive results receipt
    employee_result = Enum.find(result.results, &(&1.country == "Argentina"))

    # $1000 - 20% tax = $800
    assert Decimal.equal?(employee_result.net_salary, Decimal.new("800.00"))
  end

  test "run_payroll processes multiple employees in parallel" do
    # Create 5 fake active employees
    Enum.each(1..5, fn i ->
      Employees.create_employee(%{
        name: "Emp #{i}",
        email: "emp#{i}@test.com",
        country: "Colombia",
        salary: 1000,
        currency: "USD"
      })
    end)

    # The engine should process all of them without crashing
    {:ok, result} = Payroll.run_payroll()
    assert result.total_employees == 5
  end

  test "unknown country uses the default fallback rule (15%)" do
    # Create a fake active employee from a country not in our explicit rules
    {:ok, _} =
      Employees.create_employee(%{
        name: "Test XX",
        email: "xx@test.com",
        country: "Uruguay",
        salary: 1000,
        currency: "USD"
      })

    {:ok, result} = Payroll.run_payroll()
    employee_result = Enum.find(result.results, &(&1.country == "Uruguay"))

    # $1000 - 15% flat tax = $850
    assert Decimal.equal?(employee_result.net_salary, Decimal.new("850.00"))
  end
end
