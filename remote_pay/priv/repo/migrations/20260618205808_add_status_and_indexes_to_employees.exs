defmodule RemotePay.Repo.Migrations.AddStatusAndIndexesToEmployees do
  use Ecto.Migration

  def change do
    alter table(:employees) do
      add :status, :string, null: false, default: "active"
    end

    create index(:employees, [:country])
    create index(:employees, [:status])
  end
end
