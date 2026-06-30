defmodule RemotePay.Repo.Migrations.CreatePayrollRuns do
  use Ecto.Migration

  def change do
    create table(:payroll_runs) do
      add(:status, :string, null: false, default: "completed")
      add(:total_employees, :integer, null: false)
      add(:total_net_payout, :decimal, null: false)
      add(:currency, :string, null: false, default: "USD")
      add(:results, :map, null: false)
      add(:ran_at, :utc_datetime, null: false)

      timestamps()
    end
  end
end
