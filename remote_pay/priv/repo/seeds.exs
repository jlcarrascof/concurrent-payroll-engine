# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     RemotePay.Repo.insert!(%RemotePay.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias RemotePay.Repo
alias RemotePay.Employees.Employee

Repo.insert!(%Employee{
  name: "Juan Perez",
  email: "juan@example.com",
  country: "Argentina",
  salary: 5000.0,
  currency: "USD"
})

Repo.insert!(%Employee{
  name: "Maria Gomez",
  email: "maria@example.com",
  country: "Colombia",
  salary: 4000.0,
  currency: "USD"
})

Repo.insert!(%Employee{
  name: "Carlos Slim",
  email: "carlos@example.com",
  country: "México",
  salary: 8000.0,
  currency: "USD"
})
