defmodule RemotePay.Repo.Migrations.CreateEmployees do
  use Ecto.Migration

  def change do
    create table(:employees) do
      add :name, :string
      add :email, :string
      add :country, :string
      add :salary, :decimal
      add :currency, :string

      timestamps(type: :utc_datetime)
    end
  end
end
