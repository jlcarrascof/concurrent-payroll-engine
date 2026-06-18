defmodule RemotePay.Employees.Employee do
  use Ecto.Schema
  import Ecto.Changeset

  schema "employees" do
    field :name, :string
    field :email, :string
    field :country, :string
    field :salary, :decimal
    field :currency, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(employee, attrs) do
    employee
    |> cast(attrs, [:name, :email, :country, :salary, :currency])
    |> validate_required([:name, :email, :country, :salary, :currency])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have a valid email format")
    |> validate_number(:salary, greater_than: Decimal.new("0.0"))
    |> validate_inclusion(:currency, ["USD", "EUR", "ARS", "COP", "MXN"], message: "is not an allowed currency")
    |> unique_constraint(:email)
  end
end

