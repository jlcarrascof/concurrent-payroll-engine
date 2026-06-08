defmodule RemotePay.EmployeesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `RemotePay.Employees` context.
  """

  @doc """
  Generate a employee.
  """
  def employee_fixture(attrs \\ %{}) do
    {:ok, employee} =
      attrs
      |> Enum.into(%{
        country: "some country",
        currency: "some currency",
        email: "some email",
        name: "some name",
        salary: "120.5"
      })
      |> RemotePay.Employees.create_employee()

    employee
  end
end
