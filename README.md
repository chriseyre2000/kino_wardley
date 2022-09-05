# KinoWardley

This is a livebook smart cell that contains a basic renderer for a Wardley Map

## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `kino_wardley` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:kino_wardley, "~> 0.1.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at <https://hexdocs.pm/kino_wardley>.

This is a sample wardley map that can be generated using the following code:
```
KinoWardley.Output.new("""
id myid8
height 400
width 800
title Tea Shop
anchor Business [0.95, 0.63]
anchor Public [0.95, 0.78]
component Cup of Tea [0.79, 0.61] label [19, -4]
component Cup [0.73, 0.78]
component Tea [0.63, 0.81]
component Hot Water [0.52, 0.80]
component Water [0.38, 0.82]
component Kettle [0.43, 0.35] label [-57, 4]
evolve Kettle [0.43, 0.62] label [16, 7]
component Power [0.1, 0.7] label [-27, 20]
evolve Power [0.1, 0.89] label [-12, 21]
Business->Cup of Tea
Public->Cup of Tea
Cup of Tea->Cup
Cup of Tea->Tea
Cup of Tea->Hot Water
Hot Water->Water
Hot Water->Kettle 
Kettle->Power
evolution Experiment->Prototype->Production->Product
""")
```

![sample wardley map](https://raw.githubusercontent.com/chriseyre2000/kino_wardley/main/cup-of-tea.png "Sample Wardley Map")



Since large parts of this are in javascript it has a javascript test suite.

The test folder has a package.json.

`npm run test`

Here is a sample livebook that can be directly opened:

[![Run in Livebook](https://livebook.dev/badge/v1/gray.svg)](https://livebook.dev/run?url=https%3A%2F%2Fgithub.com%2Fchriseyre2000%2Flivebooks%2Fblob%2Fmain%2Fphoenix-wardley-map.livemd)

