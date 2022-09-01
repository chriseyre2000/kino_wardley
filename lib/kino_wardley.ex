defmodule Kino.Wardley do
  @moduledoc false

  use Kino.JS
  use Kino.SmartCell, name: "Wardley Map"
  use Kino.JS.Live

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
    Kino.Wardley.new("""
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
    xevolve Kettle [0.43, 0.62]
    component Power [0.10, 0.71]
    xevolve Power [0.10, 0.89]
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

  asset "main.js" do
    """
        import "https://d3js.org/d3.v7.js"

        function parseSpec(specLines) {
          let summary = specLines.reduce((acc, item) => {
            let trimedItem = item.trim();

            if (trimedItem.startsWith("id")) {
              const name = trimedItem.split(" ")[1];
              acc["__id"] = name
            }
            if (trimedItem.startsWith("width")) {
              const name = trimedItem.split(" ")[1];
              acc["__width"] = name
            }
            if (trimedItem.startsWith("height")) {
              const name = trimedItem.split(" ")[1];
              acc["__height"] = name
            }
            if (trimedItem.startsWith("background")) {
              const name = trimedItem.split(" ")[1];
              acc["__background"] = name
            }
            if (trimedItem.startsWith("padding")) {
              const name = trimedItem.split(" ")[1];
              acc["__padding"] = name
            }

            if (trimedItem.startsWith("anchor")) {
               const name = /anchor (?<name>[^ $]*)/.exec(trimedItem).groups.name
               let parts = trimedItem.split("[");
               parts = parts[1];
               parts = parts.split("]");
               parts = parts[0];
               parts = parts.split(",");
               const x = parseFloat(parts[1])
               const y = parseFloat(parts[0])

               acc[name] = {name: name, x: x, y: y, type: "anchor" }
            }

            if (trimedItem.startsWith("component")) {
              const name = /component\s([^\[]*)\s\\[/.exec(trimedItem)[1]
              let parts = trimedItem.split("[");
              parts = parts[1];
              parts = parts.split("]");
              parts = parts[0];
              parts = parts.split(",");
              const x = parseFloat(parts[1]);
              const y = parseFloat(parts[0]);

              acc[name] = {name: name, x: x, y: y, type: "component" }
            }

            if (trimedItem.startsWith("evolve")) {
              const name = /evolve\s([^\[]*)\s\\[/.exec(trimedItem)[1]
              let parts = trimedItem.split("[");
              parts = parts[1];
              parts = parts.split("]");
              parts = parts[0];
              parts = parts.split(",");
              const x = parseFloat(parts[1]);
              const y = parseFloat(parts[0]);

              acc[name + "__evolve"] = {name: name, x: x, y: y, type: "evolve" }
            }

            return acc
          },{});

          return summary;
        }

        function drawAxis(svg, xaxis, yaxis, padding) {
          // y axis
          svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", xaxis(0))
            .attr("y1", yaxis(0) )
            .attr("x2", xaxis(0))
            .attr("y2", yaxis(1));

          // x axis
          svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", xaxis(0))
            .attr("y1", yaxis(0) )
            .attr("x2", xaxis(1))
            .attr("y2", yaxis(0));

          //Boundaries
          svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", xaxis(0.25))
            .attr("y1", yaxis(0) )
            .attr("x2", xaxis(0.25))
            .attr("y2", yaxis(1));

          svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", xaxis(0.5))
            .attr("y1", yaxis(0) )
            .attr("x2", xaxis(0.5))
            .attr("y2", yaxis(1));

          svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", xaxis(0.75))
            .attr("y1", yaxis(0) )
            .attr("x2", xaxis(0.75))
            .attr("y2", yaxis(1));

          svg.append("text")
          .attr("x", xaxis(0))
          .attr("y", yaxis(0) + (padding * 0.75))
          .text(() => "Genesis")

          svg.append("text")
          .attr("x", xaxis(0.25))
          .attr("y", yaxis(0) + (padding * 0.75))
          .text(() => "Custom Built")

          svg.append("text")
          .attr("x", xaxis(0.5))
          .attr("y", yaxis(0) + (padding * 0.75))
          .text(() => "Product (+ Rental)")

          svg.append("text")
          .attr("x", xaxis(0.75))
          .attr("y", yaxis(0) + (padding * 0.75))
          .text(() => "Commodity (+ Utility)")

          svg.append("text")
          .attr("x", xaxis(0) - 1 * padding)
          .attr("y", yaxis(1) - 0.25 * padding)
          .text(() => "Value Chain");
        }

        function drawLines(svg, xaxis, yaxis, specLines, summary) {
          // Lines between
          specLines.forEach((item) => {
            if(item.includes("->")) {
              const parts = item.split("->");

              if(summary[parts[0].trim()] != undefined && summary[parts[1].trim()] != undefined) {
                let start = summary[parts[0].trim()];
                let end = summary[parts[1].trim()];
                let startEvolved = undefined
                let endEvolved = undefined

                svg.append('line')
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("x1", xaxis(start.x))
                .attr("y1", yaxis(start.y) )
                .attr("x2", xaxis(end.x))
                .attr("y2", yaxis(end.y));

                if(summary[start.name + "__evolve"] != undefined) {
                  let startEvolved = summary[start.name + "__evolve"]

                  svg.append('line')
                  .style("stroke", "red")
                  .style("stroke-width", 1)
                  .attr("x1", xaxis(startEvolved.x))
                  .attr("y1", yaxis(startEvolved.y) )
                  .attr("x2", xaxis(end.x))
                  .attr("y2", yaxis(end.y));
                }

                if(summary[end.name + "__evolve"] != undefined) {
                  let endEvolved = summary[end.name + "__evolve"]

                  svg.append('line')
                  .style("stroke", "red")
                  .style("stroke-width", 1)
                  .attr("x1", xaxis(start.x))
                  .attr("y1", yaxis(start.y) )
                  .attr("x2", xaxis(endEvolved.x))
                  .attr("y2", yaxis(endEvolved.y));
                }

                if (startEvolved != undefined && endEvolved != undefined) {
                  svg.append('line')
                  .style("stroke", "red")
                  .style("stroke-width", 1)
                  .attr("x1", xaxis(startEvolved.x))
                  .attr("y1", yaxis(startEvolved.y) )
                  .attr("x2", xaxis(endEvolved.x))
                  .attr("y2", yaxis(endEvolved.y));
                }

              }
            }
          })
        }

        function circlesAndText(svg, xaxis, yaxis, summary) {
          // Circles and text
          for (const [key, item] of Object.entries(summary)) {
            if (item.type === "anchor") {
              svg.append("text")
              .attr("x", xaxis(item.x))
              .attr("y", yaxis(item.y))
              .text(() => item.name)
            }

            if (item.type === "component") {
              if(summary[item.name + "__evolve"] != undefined) {
                let evolved = summary[item.name + "__evolve"]

                svg.append('line')
                .style("stroke", "red")
                .style("stroke-width", 1)
                .style("stroke-dasharray", ("3, 3"))
                .attr("x1", xaxis(item.x))
                .attr("y1", yaxis(item.y) )
                .attr("x2", xaxis(evolved.x))
                .attr("y2", yaxis(evolved.y));
              }

              svg.append("circle")
              .attr("cx", xaxis(item.x))
              .attr("cy", yaxis(item.y))
              .attr("r", 3)
              .style("stroke", "black")
              .style("fill", "white");

              svg.append('rect')
              .attr('x', xaxis(item.x) + 7)
              .attr('y', yaxis(item.y) - 7)
              .attr('width', 8 * item.name.length)
              .attr('height', 14)
              .attr('stroke', 'white')
              .attr('fill', 'white');

              svg.append('text')
              .attr("x", xaxis(item.x) + 7)
              .attr("y", yaxis(item.y) + 5)
              .text(() => item.name)
            }

            if(item.type === "evolve") {
              svg.append('circle')
              .attr("cx", xaxis(item.x))
              .attr("cy", yaxis(item.y))
              .attr("r", 3)
              .style("stroke", "red")
              .style("fill", "white")

              svg.append('rect')
              .attr('x', xaxis(item.x) + 7)
              .attr('y', yaxis(item.y) - 7)
              .attr('width', 8 * item.name.length)
              .attr('height', 14)
              .attr('stroke', 'white')
              .attr('fill', 'white');

              svg.append('text')
              .attr("x", xaxis(item.x) + 7)
              .attr("y", yaxis(item.y) + 5)
              .style('fill', 'red')
              .text(() => item.name)
            }
          }
        }

        export function init(ctx, spec) {

          const specLines = spec.split("\\n")

          const summary = parseSpec(specLines)

          const myId = summary["__id"] ||  "my-id"
          const width = parseInt(summary["__width"] ||  "800");
          const height = parseInt(summary["__height"] || "400");
          const background = summary["__background"] || "white";
          const padding = parseInt(summary["__padding"] || "20");

          // Start drawing
          ctx.root.innerHTML = `<svg id=${myId} style="margin: 0 auto; display: block;"></svg>`;

          let svg = d3.select(`#${myId}`)
          .attr('width', width)
          .attr('height', height)
          .style('background-color', background);

          // Note that the maths y axis is the reflection of the d3 one!
          const yaxis = d3.scaleLinear()
          .domain([0, 1.0])
          .range([height - padding, padding]);

          const xaxis = d3.scaleLinear()
          .domain([0, 1.0])
          .range([padding, width - padding]);

          drawAxis(svg, xaxis, yaxis, padding)

          drawLines(svg, xaxis, yaxis, specLines, summary)

          circlesAndText(svg, xaxis, yaxis, summary)

        // ==== end of JS ====
        }
    """
  end

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
