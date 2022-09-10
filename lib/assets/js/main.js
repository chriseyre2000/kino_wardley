import "./d3.v7.js"

export function extractNameLocationAndOffset(from) {

  const parts = from.split(" label ")

  if (parts.length === 0) {
    return {}
  }

  const output = /\w+\s(?<name>[^\[0]*)(\[*)(?<first>[^\,\s]*)(\s*)(,*)(\s*)(?<second>[^\]]*)/.exec(parts[0]).groups
  
  if (parts.length === 1) {
    output["third"] = '';
    output["fourth"] = '';
    return output;
  }

  const subparts = parts[1].replace("[","").replace("]","").replace(" ","").split(",")

  if (subparts.length == 1) {
    output["third"] = subparts[0];
    output["fouth"] = '';
    return output;
  }

  output["third"] = subparts[0];
  output["fourth"] = subparts[1];
  return output;
}

export function parseSpec(specLines) {
  let summary = specLines.reduce((acc, i) => {
    let item = i.trim();

    if (item.startsWith("style ")) {
      const name = item.replace("style ", "");
      acc["__style"] = name;
    }

    if (item.startsWith("title ")) {
      const name = item.replace("title ", "");
      acc["__title"] = name;
    }

    if (item.startsWith("id")) {
      const name = item.split(" ")[1];
      acc["__id"] = name
    }
    if (item.startsWith("width")) {
      const name = item.split(" ")[1];
      acc["__width"] = name
    }
    if (item.startsWith("height")) {
      const name = item.split(" ")[1];
      acc["__height"] = name
    }
    if (item.startsWith("background")) {
      const name = item.split(" ")[1];
      acc["__background"] = name
    }
    if (item.startsWith("padding")) {
      const name = item.split(" ")[1];
      acc["__padding"] = name
    }

    if (item.startsWith("evolution ")) {
      const parts = item.replace("evolution", "").trim().split("->")
      acc["__evolution"] = parts;
    }

    if (item.startsWith("anchor ")) {
       const details = extractNameLocationAndOffset(item)
       const name = details.name.trim()
       const x = parseFloat(details.second)
       const y = parseFloat(details.first)
       const dx = parseInt(details.third || "0")
       const dy = parseInt(details.fourth || "0")
 
       acc[name] = {name: name, x: x, y: y, dx: dx, dy: dy, type: "anchor" }
    }

    if (item.startsWith("component ")) {
      const details = extractNameLocationAndOffset(item);
      const name = details.name.trim();
      const x = parseFloat(details.second);
      const y = parseFloat(details.first);
      const dx = parseInt(details.third || "0");
      const dy = parseInt(details.fourth || "0");
      const inertia = item.includes(" inertia ");

      acc[name] = {name: name, x: x, y: y, dx: dx, dy: dy, inertia: inertia, type: "component" }
    }

    if (item.startsWith("evolve ")) {
      const details = extractNameLocationAndOffset(item)
      const name = details.name.trim()

      if (details.second === '') {
        const x = parseFloat(details.first)

        const base = acc[name]
        const dx = parseInt(details.third || "0")
        const dy = parseInt(details.fourth || "0")

        acc[name + "__evolve"] = {name: name, x: x, y: base.y, dx: dx, dy: dy, type: "evolve" }
      }
      else {
        const x = parseFloat(details.second)
        const y = parseFloat(details.first)
        const dx = parseInt(details.third || "0")
        const dy = parseInt(details.fourth || "0")

        acc[name + "__evolve"] = {name: name, x: x, y: y, dx: dx, dy: dy, type: "evolve" }
      }
    }

    if (item.startsWith("note ")) {
      const details = extractNameLocationAndOffset(item)
      const name = details.name.trim()
      const x = parseFloat(details.second)
      const y = parseFloat(details.first)

      acc[name] = {name: name, x: x, y: y, dx: 0, dy: 0, type: "note" }
    }

    if (item.startsWith("annotation ")) {
      const label =  /annotation\s(?<label>[^\[]*)/.exec(item).groups.label.trim()
      const description = /.*](?<description>.*)/.exec(item).groups.description.trim()
      const locations = /\[(?<locations>.*)\]/.exec(item).groups.locations;
      acc[label] = {label: label, description: description, points: buildPoints(locations), type: "annotation" }
    }

    if (item.startsWith("annotations ")) {
      const groups = /annotations *\[(?<y>[^,]*)\s*,\s*(?<x>[^\]]*)/.exec(item).groups;
      const x = parseFloat(groups.x);
      const y = parseFloat(groups.y);
      acc["__annotations"] = {x: x, y: y, type: "annotations"}
    }

    if (item.startsWith("group ")) {
      const groups = /group*\s(?<name>[^\[]*)\[*(?<cy>[^,]*)(,\s)*(?<cx>[^,]*)(,\s)*(?<ry>[^,]*)(,\s)*(?<rx>[^\]]*)(\]\s)*(?<fill>[^\s]*)(\s*)(?<border>.*)/.exec(item).groups;
      const name = groups.name.trim();
      const cx = parseFloat(groups.cx || '0');
      const cy = parseFloat(groups.cy || '0');
      const rx = parseInt(groups.rx || '0');
      const ry = parseInt(groups.ry || '0');
      const fill = groups.fill;
      const border = groups.border || fill;

      acc[name] = {name: name, cx: cx, cy: cy, rx: rx, ry: ry, fill: fill, border: border, type: "group"}
    }

    return acc
  },{});

  return summary;
}

export function buildPoints(input) {
  if (input == "") return [] 
  
  let parts = input.replaceAll(" ","").replaceAll("[","").replaceAll("]","").split(",");

  return parts.reduce(function(result, _, index, array) {
    if (index % 2 === 0)
      result.push( {x: parseFloat(array[index + 1]), y: parseFloat(array[index])}  );
    return result;
  }, []);

}

function drawAxis(svg, xaxis, yaxis, padding, summary) {

  const labels = summary["__evolution"];
  const title = summary["__title"]; 
  const style = summary["__style"];

  const defaultLabels = ["Genesis", "Custom Built", "Product (+ Rental)", "Commodity (+ Utility)"]
  const displayLabels = labels === undefined ? defaultLabels : labels;

  if (style === "wardley") {
    const def = svg.append('defs');
    const lg = def.append("linearGradient").attr("id", "wardley");
    lg.append("stop").attr("offset", "0%").attr("stop-color", "lightgrey");
    lg.append("stop").attr("offset", "30%").attr("stop-color", "white");
    lg.append("stop").attr("offset", "70%").attr("stop-color", "white");
    lg.append("stop").attr("offset", "100%").attr("stop-color", "lightgrey");
  
    svg.append('rect')
    .attr('x', xaxis(0))
    .attr('y', yaxis(1))
    .attr('width', xaxis(1) - padding)
    .attr('height', yaxis(0) - padding) 
    .attr('fill', 'url(#wardley)');
  }

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
  .text(() => displayLabels[0])

  svg.append("text")
  .attr("x", xaxis(0.25))
  .attr("y", yaxis(0) + (padding * 0.75))
  .text(() => displayLabels[1])

  svg.append("text")
  .attr("x", xaxis(0.5))
  .attr("y", yaxis(0) + (padding * 0.75))
  .text(() => displayLabels[2])

  svg.append("text")
  .attr("x", xaxis(0.75))
  .attr("y", yaxis(0) + (padding * 0.75))
  .text(() => displayLabels[3])

  svg.append("text")
  .attr("x", xaxis(0) - 1 * padding)
  .attr("y", yaxis(1) - 0.25 * padding)
  .text(() => "Value Chain");

  if (title) {
    svg.append("text")
    .attr("x", xaxis(0.5) - (5 * title.length))
    .attr("y", yaxis(1))
    .style("font", "20px sans-serif")
    .text(() => title)
  }
}

function drawLines(svg, xaxis, yaxis, specLines, summary) {
  // Lines between
  specLines.forEach((item) => {
    //flow
    if (item.includes("+<>")) {
      const parts = item.split("+<>");

      if(summary[parts[0].trim()] != undefined && summary[parts[1].trim()] != undefined) {
        let start = summary[parts[0].trim()];
        let end = summary[parts[1].trim()];

        svg.append('line')
        .style("stroke", "LightCyan")
        .style("stroke-width", 7)
        .attr("x1", xaxis(start.x))
        .attr("y1", yaxis(start.y) )
        .attr("x2", xaxis(end.x))
        .attr("y2", yaxis(end.y));

        svg.append('line')
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", xaxis(start.x))
        .attr("y1", yaxis(start.y) )
        .attr("x2", xaxis(end.x))
        .attr("y2", yaxis(end.y));
      }
    }

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
  const style = summary["__style"];
  
  // Circles and text
  for (const [key, item] of Object.entries(summary)) {
    if (item.type === "anchor") {
      svg.append("text")
      .attr("x", xaxis(item.x) + item.dx)
      .attr("y", yaxis(item.y) + item.dy)
      .attr("font-weight", () => 700)
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

      if (style === undefined) {
        svg.append('rect')
        .attr('x', xaxis(item.x) + 7 + item.dx)
        .attr('y', yaxis(item.y) - 7 + item.dy)
        .attr('width', 7 * item.name.length)
        .attr('height', 14)
        .attr('stroke', 'white')
        .attr('fill', 'white');
      }

      svg.append('text')
      .attr("x", xaxis(item.x) + 7 + item.dx)
      .attr("y", yaxis(item.y) + 5 + item.dy)
      .text(() => item.name)

      if (item.inertia) {
        svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 5)
        .attr("x1", xaxis(item.x) + 30)
        .attr("y1", yaxis(item.y) -10 )
        .attr("x2", xaxis(item.x) + 30)
        .attr("y2", yaxis(item.y) + 10);
      }
    }

    if(item.type === "evolve") {
      svg.append('circle')
      .attr("cx", xaxis(item.x))
      .attr("cy", yaxis(item.y))
      .attr("r", 3)
      .style("stroke", "red")
      .style("fill", "white")

      if (style === undefined) {
        svg.append('rect')
        .attr('x', xaxis(item.x) + 7 + item.dx)
        .attr('y', yaxis(item.y) - 7 + item.dy)
        .attr('width', 7 * item.name.length)
        .attr('height', 14)
        .attr('stroke', 'white')
        .attr('fill', 'white');
      }

      svg.append('text')
      .attr("x", xaxis(item.x) + 7 + item.dx)
      .attr("y", yaxis(item.y) + 5 + item.dy)
      .style('fill', 'red')
      .text(() => item.name)
    }

    if (item.type === "note") {
      if (style === undefined) {
        svg.append('rect')
        .attr('x', xaxis(item.x) + 7 + item.dx)
        .attr('y', yaxis(item.y) - 7 + item.dy)
        .attr('width', 7 * item.name.length)
        .attr('height', 14)
        .attr('stroke', 'white')
        .attr('fill', 'white');
      }
      svg.append('text')
      .attr("x", xaxis(item.x) + 7 + item.dx)
      .attr("y", yaxis(item.y) + 5 + item.dy)
      .attr("font-weight", () => 700)
      .text(() => item.name)  
    }
  }
}

function drawGroups(svg, xaxis, yaxis, summary) {
  for (const [_key, item] of Object.entries(summary)) {
    if (item.type === "group") {
      if (item.border !== "") {
        svg.append('ellipse')
        .attr('cx', xaxis(item.cx))
        .attr('cy', yaxis(item.cy))
        .attr('rx', item.rx)
        .attr('ry', item.ry)
        .attr('stroke', item.border)
        .attr('fill', item.fill);
      }
    }
  }  
}

function annotations(svg, xaxis, yaxis, summary) {

  let box = summary["__annotations"];
  let dy = 0;
  // Annotations
  for (const [_key, item] of Object.entries(summary)) {
    if (item.type === "annotation") {

      if (box !== undefined) {
        svg.append('text')
        .attr("x", xaxis(box.x))
        .attr("y", yaxis(box.y) + dy)
        .text(() => `${item.label} ${item.description}`);
       
        dy += 20;
      }

      // Loop over points
      for(const point of item.points) {
        svg.append('circle')
        .attr("cx", xaxis(point.x) + 5)
        .attr("cy", yaxis(point.y))
        .attr("r", 10)
        .style("stroke", "black")
        .style("fill", "white")

        svg.append('text')
        .attr("x", xaxis(point.x))
        .attr("y", yaxis(point.y) + 5)
        .text(() => item.label)
      }
    }
  }
}  

export function init(ctx, spec) {

  const specLines = spec.split("\n")
  const summary = parseSpec(specLines)

  const myId = summary["__id"] ||  "my-id"
  const width = parseInt(summary["__width"] ||  "800");
  const height = parseInt(summary["__height"] || "400");
  const background = summary["__background"] || "white";
  const padding = parseInt(summary["__padding"] || "20");

  // Start drawing
  ctx.root.innerHTML = `<svg id='${myId}' style="margin: 0 auto; display: block;"></svg>`;

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

  drawAxis(svg, xaxis, yaxis, padding, summary)
  drawGroups(svg, xaxis, yaxis, summary)
  drawLines(svg, xaxis, yaxis, specLines, summary)
  circlesAndText(svg, xaxis, yaxis, summary)
  annotations(svg, xaxis, yaxis, summary)
}
