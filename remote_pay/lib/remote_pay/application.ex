defmodule RemotePay.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      RemotePayWeb.Telemetry,
      RemotePay.Repo,
      {DNSCluster, query: Application.get_env(:remote_pay, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: RemotePay.PubSub},
      # Start a worker by calling: RemotePay.Worker.start_link(arg)
      # {RemotePay.Worker, arg},
      # Start to serve requests, typically the last entry
      RemotePayWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: RemotePay.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RemotePayWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
