defmodule Kino.Wardley do
  @moduledoc """
  This is a smart cell that can be used to add a Wardley Map to a page.

  Wardley Maps are a chain of needs (a value chain) plotted against
  an evolution axis.

  See https://en.wikipedia.org/wiki/Wardley_map for a description of what a wardley map is.

  They are typically used to discuss strategy.

  """

  use Kino.JS, assets_path: "lib/assets/js"
  use Kino.SmartCell, name: "Wardley Map"
  use Kino.JS.Live

  @doc """
  This is used to create the smart cell.
  """
  def new(spec) do
    Kino.JS.new(__MODULE__, spec, export_info_string: "wardley")
  end

  @setup """
  {
    "width": 400,
    "height": 800
  }
  """

  @impl true
  def to_source(_) do
    '''
    KinoWardley.Output.new("""
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
    """)
    '''
  end

  @impl true
  def to_attrs(_), do: %{}

  @setup """
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
  """

  @impl true
  def handle_connect(ctx) do
    {:ok, @setup, ctx}
  end
end
