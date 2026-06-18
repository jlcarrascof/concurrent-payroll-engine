defmodule RemotePay.Repo.Migrations.AddUniqueEmailIndex do
  use Ecto.Migration

  def change do
    create(unique_index(:employees, [:email]))
  end
end
