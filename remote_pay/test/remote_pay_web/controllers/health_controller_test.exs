defmodule RemotePayWeb.HealthControllerTest do
  use RemotePayWeb.ConnCase

  test "GET /api/health retorna status ok y database connected", %{conn: conn} do
    conn = get(conn, ~p"/api/health")
    body = json_response(conn, 200)

    assert body["status"] == "ok"
    assert body["database"] == "connected"
    assert Map.has_key?(body, "uptime_seconds")
  end
end
