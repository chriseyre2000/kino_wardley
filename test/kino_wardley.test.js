import { parseSpec, extractNameLocationAndOffset } from "../lib/assets/js/main"

test('Empty spec is empty', () => {
  expect(parseSpec([])).toStrictEqual({});
});

test('Sample spec parses to expected', () => {

  const input = `
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
  Kettle->Power`

  const expected = {
    "Business": {
      "name": "Business",
      "type": "anchor",
      "dx": 0,
      "dy": 0,
      "x": 0.63,
      "y": 0.95,
    },
    "Cup": {
      "name": "Cup",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.78,
      "y": 0.73,
    },
    "Cup of Tea": {
      "name": "Cup of Tea",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.61,
      "y": 0.79,
    },
    "Hot Water": {
      "name": "Hot Water",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.8,
      "y": 0.52,
    },
    "Kettle": {
      "name": "Kettle",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.35,
      "y": 0.43,
    },
    "Kettle__evolve": {
      "name": "Kettle",
      "type": "evolve",
      "dx": 0,
      "dy": 0,
      "x": 0.62,
      "y": 0.43,
    },
    "Power": {
      "name": "Power",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.71,
      "y": 0.1,
    },
    "Power__evolve": {
      "name": "Power",
      "type": "evolve",
      "dx": 0,
      "dy": 0,
      "x": 0.89,
      "y": 0.1,
    },
    "Public": {
      "name": "Public",
      "type": "anchor",
      "dx": 0,
      "dy": 0,
      "x": 0.78,
      "y": 0.95,
    },
    "Tea": {
      "name": "Tea",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.81,
      "y": 0.63,
    },
    "Water": {
      "name": "Water",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.82,
      "y": 0.38,
    },
    "__height": "400",
    "__id": "myid7",
    "__width": "800",
  }

  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);
});

test('Online wardley map parses to expected', () => {

  const input = `
  id myid7
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
  evolve Kettle 0.62 label [16, 7]
  component Power [0.1, 0.7] label [-27, 20]
  evolve Power 0.89 label [-12, 21]
  Business->Cup of Tea
  Public->Cup of Tea
  Cup of Tea->Cup
  Cup of Tea->Tea
  Cup of Tea->Hot Water
  Hot Water->Water
  Hot Water->Kettle 
  Kettle->Power
  
  annotation 1 [[0.43,0.49],[0.08,0.79]] Standardising power allows Kettles to evolve faster
  annotation 2 [0.48, 0.85] Hot water is obvious and well known
  annotations [0.60, 0.02]
  
  note +a generic note appeared [0.23, 0.33]
  
  style wardley`

  const expected = {
    "__title": "Tea Shop",
    "Business": {
      "name": "Business",
      "type": "anchor",
      "dx": 0,
      "dy": 0,
      "x": 0.63,
      "y": 0.95,
    },
    "Cup": {
      "name": "Cup",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.78,
      "y": 0.73,
    },
    "Cup of Tea": {
      "name": "Cup of Tea",
      "type": "component",
      "dx": 19,
      "dy": -4,
      "x": 0.61,
      "y": 0.79,
    },
    "Hot Water": {
      "name": "Hot Water",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.8,
      "y": 0.52,
    },
    "Kettle": {
      "name": "Kettle",
      "type": "component",
      "dx": -57,
      "dy": 4,
      "x": 0.35,
      "y": 0.43,
    },
    "Kettle__evolve": {
      "name": "Kettle",
      "type": "evolve",
      "dx": 16,
      "dy": 7,
      "x": 0.62,
      "y": 0.43,
    },
    "Power": {
      "name": "Power",
      "type": "component",
      "dx": -27,
      "dy": 20,
      "x": 0.7,
      "y": 0.1,
    },
    "Power__evolve": {
      "name": "Power",
      "type": "evolve",
      "dx": -12,
      "dy": 21,
      "x": 0.89,
      "y": 0.1,
    },
    "Public": {
      "name": "Public",
      "type": "anchor",
      "dx": 0,
      "dy": 0,
      "x": 0.78,
      "y": 0.95,
    },
    "Tea": {
      "name": "Tea",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.81,
      "y": 0.63,
    },
    "Water": {
      "name": "Water",
      "type": "component",
      "dx": 0,
      "dy": 0,
      "x": 0.82,
      "y": 0.38,
    },
    "1": {
      "description": "Standardising power allows Kettles to evolve faster",
      "type": "annotation",
      "label": "1",
      "points": [
        {
          "x": 0.49,
          "y": 0.43,
        },
        {
          "x": 0.79,
          "y": 0.08,
        },
      ],
    },
    "2": {
      "description": "Hot water is obvious and well known",
      "label": "2",
      "type": "annotation",
      "points": [
        {
          "x": 0.85,
          "y": 0.48,
        },
      ],
    },

    "+a generic note appeared": {
      "dx": 0,
      "dy": 0,
      "name": "+a generic note appeared",
      "type": "note",
      "x": 0.33,
      "y": 0.23,
    },
    "__annotations": {
      "type": "annotations",
      "x": 0.02,
      "y": 0.6,
    },
    "__style": "wardley",
    "__height": "400",
    "__id": "myid7",
    "__width": "800",
  }
  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);
});

test("regex extract full", () => {
  const output = extractNameLocationAndOffset("component Cup of Tea [0.79, 0.61] label [10, 11]")
  const expected = {
    "first": "0.79",
    "fourth": "11",
    "name": "Cup of Tea ",
    "second": "0.61",
    "third": "10",
  }
  expect(output).toEqual(expected);
})

test("regex extract short", () => {
  const output = extractNameLocationAndOffset("component Cup of Tea [0.79, 0.61]")
  const expected = {
    "first": "0.79",
    "fourth": "",
    "name": "Cup of Tea ",
    "second": "0.61",
    "third": "",
  }
  expect(output).toEqual(expected);
})

test("regex working test", () => {
  const output = /\w+\s(?<name>[^\[]*)\[(?<first>[^\,]*),\s*(?<second>[^\]]*)]\s*[label\s\[]*(?<third>[^,]*)[,\s]*(?<fourth>[^\]]*)/.exec("component Cup of Tea [0.79, 0.61] label [10, 11]").groups
  const expected = {
    "first": "0.79",
    "fourth": "11",
    "name": "Cup of Tea ",
    "second": "0.61",
    "third": "10",
  }
  expect(output).toEqual(expected);
})

test("parseEvolutionAxis", () => {
  const input = "evolution First->Second->Third->Fourth"

  const expected = {
    __evolution: [
      "First",
      "Second",
      "Third",
      "Fourth"
    ]
  }

  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);
})

