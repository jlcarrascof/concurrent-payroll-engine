defmodule RemotePay.Employees.Employee do
  use Ecto.Schema
  import Ecto.Changeset

  @currencies ["USD", "EUR", "ARS", "COP", "MXN"]
  @statuses ["active", "inactive"]

  schema "employees" do
    field(:name, :string)
    field(:email, :string)
    field(:country, :string)
    field(:salary, :decimal)
    field(:currency, :string, default: "USD")
    field(:status, :string, default: "active")

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(employee, attrs) do
    employee
    |> cast(attrs, [:name, :email, :country, :salary, :currency, :status])
    |> validate_required([:name, :email, :country, :salary])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have a valid email format")
    |> validate_number(:salary, greater_than: Decimal.new("0.0"))
    |> validate_inclusion(:currency, @currencies, message: "is not an allowed currency")
    |> validate_inclusion(:status, @statuses, message: "is not a valid status")
    |> unique_constraint(:email)
  end
end
