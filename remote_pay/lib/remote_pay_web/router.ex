defmodule RemotePayWeb.Router do
  use RemotePayWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/api", RemotePayWeb do
    pipe_through(:api)

    # Endpoint especial para servidores (AWS/K8s)
    get("/health", HealthController, :index)

    # Esto genera automáticamente los 5 endpoints del CRUD:
    # GET (listar), GET (ver uno), POST (crear), PUT/PATCH (actualizar), DELETE (borrar)
    resources("/employees", EmployeeController, except: [:new, :edit])
  end
end
