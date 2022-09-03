import {parseSpec} from "../lib/assets/js/main"

test('Empty spec is empty', () => {
  expect(parseSpec([])).toStrictEqual({});
});

test('Sample spec renders to expected', () => {

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

  const expected =  {
       "Business": {
         "name": "Business",
         "type": "anchor",
         "x": 0.63,
         "y": 0.95,
       },
       "Cup": {
         "name": "Cup",
         "type": "component",
         "x": 0.78,
         "y": 0.73,
       },
       "Cup of Tea": {
         "name": "Cup of Tea",
         "type": "component",
         "x": 0.61,
         "y": 0.79,
       },
       "Hot Water": {
         "name": "Hot Water",
         "type": "component",
         "x": 0.8,
         "y": 0.52,
       },
       "Kettle": {
         "name": "Kettle",
         "type": "component",
         "x": 0.35,
         "y": 0.43,
       },
       "Kettle__evolve": {
         "name": "Kettle",
         "type": "evolve",
         "x": 0.62,
         "y": 0.43,
       },
       "Power": {
         "name": "Power",
         "type": "component",
         "x": 0.71,
         "y": 0.1,
       },
       "Power__evolve": {
         "name": "Power",
         "type": "evolve",
         "x": 0.89,
         "y": 0.1,
      },
       "Public": {
         "name": "Public",
         "type": "anchor",
         "x": 0.78,
         "y": 0.95,
       },
       "Tea": {
         "name": "Tea",
         "type": "component",
         "x": 0.81,
         "y": 0.63,
       },
       "Water": {
         "name": "Water",
         "type": "component",
         "x": 0.82,
         "y": 0.38,
       },
       "__height": "400",
       "__id": "myid7",
       "__width": "800",
     }

  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);


});