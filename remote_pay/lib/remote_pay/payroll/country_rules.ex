defmodule RemotePay.Payroll.CountryRules do
  @moduledoc """
  Tax withholding rules per country. Pattern matching replaces
  traditional if/else statements — each clause is a distinct rule.
  """

  def calculate_net(%{country: "Argentina", salary: salary}) do
    # 17% withholding + 3% health insurance
    deduction = Decimal.mult(salary, Decimal.new("0.20"))
    Decimal.sub(salary, deduction)
  end

  def calculate_net(%{country: "Colombia", salary: salary}) do
    # 4% health + 4% pension
    deduction = Decimal.mult(salary, Decimal.new("0.08"))
    Decimal.sub(salary, deduction)
  end

  def calculate_net(%{country: "México", salary: salary}) do
    # ISR 10% + IMSS 2%
    deduction = Decimal.mult(salary, Decimal.new("0.12"))
    Decimal.sub(salary, deduction)
  end

  def calculate_net(%{country: "Brasil", salary: salary}) do
    # Approximate INSS
    deduction = Decimal.mult(salary, Decimal.new("0.11"))
    Decimal.sub(salary, deduction)
  end

  # Catch-all clause: the general fallback (any other country uses a flat 15% withholding)
  def calculate_net(%{salary: salary}) do
    deduction = Decimal.mult(salary, Decimal.new("0.15"))
    Decimal.sub(salary, deduction)
  end

  def tax_rate(%{country: "Argentina"}), do: 20
  def tax_rate(%{country: "Colombia"}), do: 8
  def tax_rate(%{country: "México"}), do: 12
  def tax_rate(%{country: "Brasil"}), do: 11
  def tax_rate(_), do: 15
end
