defmodule KinoWardley.Output do
  use Kino.JS, assets_path: "lib/assets/js"

  @moduledoc """
  This is the livecell used to render Wardley Maps.
  """

  @doc """
  Create a wardley map.

  Here is a sample spec:
  ```
    id myid7
    height 400
    width 800
    anchor Business [0.95, 0.63]
    anchor Public [0.95, 0.78]
    component Cup of Tea [0.79, 0.61]
    component Cup [0.73, 0.78]
    component Tea [0.63, 0.81]
    component Hot Water [0.52, 0.80]
    component Water [0.38, 0.82]
    component Kettle [0.43, 0.35]
    evolve Kettle [0.43, 0.62]
    component Power [0.10, 0.71]
    evolve Power [0.10, 0.89]
    Business->Cup of Tea
    Public->Cup of Tea
    Cup of Tea->Cup
    Cup of Tea->Tea
    Cup of Tea->Hot Water
    Hot Water->Water
    Hot Water->Kettle
    Kettle->Power
  ```
  """
  def new(spec) do
    Kino.JS.new(__MODULE__, spec)
  end
end
