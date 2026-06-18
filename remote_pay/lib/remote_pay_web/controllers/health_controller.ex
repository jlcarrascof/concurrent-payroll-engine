defmodule RemotePayWeb.HealthController do
  use RemotePayWeb, :controller

  def index(conn, _params) do
    db_status = check_database()

    json(conn, %{
      status: "ok",
      database: db_status,
      version: "1.0.0",
      uptime_seconds: uptime_seconds(),
      timestamp: DateTime.utc_now()
    })
  end

  defp check_database do
    case RemotePay.Repo.query("SELECT 1") do
      {:ok, _} -> "connected"
      {:error, _} -> "disconnected"
    end
  end

  defp uptime_seconds do
    {uptime_ms, _} = :erlang.statistics(:wall_clock)
    div(uptime_ms, 1000)
  end
end
