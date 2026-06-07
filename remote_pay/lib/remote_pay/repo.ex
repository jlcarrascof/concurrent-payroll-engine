defmodule RemotePay.Repo do
  use Ecto.Repo,
    otp_app: :remote_pay,
    adapter: Ecto.Adapters.Postgres
end
