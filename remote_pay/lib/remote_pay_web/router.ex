defmodule RemotePayWeb.Router do
  use RemotePayWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/api", RemotePayWeb do
    pipe_through(:api)

    # Special endpoint for servers (AWS/K8s)
    get("/health", HealthController, :index)

    # This automatically generates the 5 CRUD endpoints:
    # GET (list), GET (show one), POST (create), PUT/PATCH (update), DELETE (delete)
    resources("/employees", EmployeeController, except: [:new, :edit])

    post("/payroll/run", PayrollController, :run)

    get("/payroll/:id/status", PayrollController, :status)
  end
end
