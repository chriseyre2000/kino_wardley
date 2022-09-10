import { parseSpec } from "../lib/assets/js/main"

test('Sample evolve spec parses to expected', () => {

  const input = `
  id myid7
  height 400
  width 800
  component Kettle [0.43, 0.35]
  evolve Kettle [0.43, 0.62]
  component Power [0.10, 0.71]
  evolve Power [0.10, 0.89]
  Kettle->Power`

  const expected = {
    "Kettle": {
      "dx": 0,
      "dy": 0,
      "name": "Kettle",
      "type": "component",
      "inertia": false,
      "xor": false,
      "x": 0.35,
      "y": 0.43,
    },
    "Kettle__evolve": {
      "dx": 0,
      "dy": 0,
      "name": "Kettle",
      "type": "evolve",
      "x": 0.62,
      "y": 0.43,
    },
    "Power": {
      "dx": 0,
      "dy": 0,
      "name": "Power",
      "type": "component",
      "inertia": false,
      "xor": false,
      "x": 0.71,
      "y": 0.1,
    },
    "Power__evolve": {
      "dx": 0,
      "dy": 0,
      "name": "Power",
      "type": "evolve",
      "x": 0.89,
      "y": 0.1,
    },
    "__height": "400",
    "__id": "myid7",
    "__width": "800",
  }

  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);
});

test('Online wardley evolve spec parses to expected', () => {

  const input = `
component Kettle [0.43, 0.35] label [-57, 4]
evolve Kettle 0.62 label [16, 7]
component Power [0.1, 0.7] label [-27, 20]
evolve Power 0.89 label [-12, 21]
`

  const expected = {
    "Kettle": {
      "dx": -57,
      "dy": 4,
      "name": "Kettle",
      "type": "component",
      "inertia": false,
      "xor": false,
      "x": 0.35,
      "y": 0.43,
    },
    "Kettle__evolve": {
      "dx": 16,
      "dy": 7,
      "name": "Kettle",
      "type": "evolve",
      "x": 0.62,
      "y": 0.43,
    },
    "Power": {
      "dx": -27,
      "dy": 20,
      "name": "Power",
      "type": "component",
      "inertia": false,
      "xor": false,
      "x": 0.7,
      "y": 0.1,
    },
    "Power__evolve": {
      "dx": -12,
      "dy": 21,
      "name": "Power",
      "type": "evolve",
      "x": 0.89,
      "y": 0.1,
    },
  }


  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);

});

test('Simplified Online wardley evolve spec parses to expected', () => {

  const input = `
  component Kettle [0.43, 0.35]
  evolve Kettle 0.62
  component Power [0.1, 0.7]
  evolve Power 0.89
  `

  const expected = {
    "Kettle": {
      "dx": 0,
      "dy": 0,
      "name": "Kettle",
      "type": "component",
      "inertia": false,
      "xor": false,
      "x": 0.35,
      "y": 0.43,
    },
    "Kettle__evolve": {
      "dx": 0,
      "dy": 0,
      "name": "Kettle",
      "type": "evolve",
      "x": 0.62,
      "y": 0.43,
    },
    "Power": {
      "dx": 0,
      "dy": 0,
      "name": "Power",
      "type": "component",
      "inertia": false,
      "xor": false,
      "x": 0.7,
      "y": 0.1,
    },
    "Power__evolve": {
      "dx": 0,
      "dy": 0,
      "name": "Power",
      "type": "evolve",
      "x": 0.89,
      "y": 0.1,
    },
  }

  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);

});