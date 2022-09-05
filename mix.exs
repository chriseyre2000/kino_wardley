defmodule KinoWardley.MixProject do
  use Mix.Project

  def project do
    [
      app: :kino_wardley,
      version: "0.4.0",
      elixir: "~> 1.13",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {Kino.Wardley.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:kino, "~> 0.6.2"},
      {:ex_doc, ">= 0.0.0", only: :dev, runtime: false}
    ]
  end

  defp package do
    [
      name: "kino_wardley",
      description: "A livebook smartcell that includes a Wardley Map.",
      files: ~w(lib lib/assets/js .formatter.exs cup-of-tea.png mix.exs README* LICENSE* CHANGELOG.md),
      licenses: ["MIT"],
      links: %{"GitHub" => "https://github.com/chriseyre2000/kino_wardley"}
    ]
  end
end
