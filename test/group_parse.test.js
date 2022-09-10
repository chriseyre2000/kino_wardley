import { parseSpec } from "../lib/assets/js/main"

test('Sample group spec parses to expected', () => {

  const input = `
  height 400
  width 800
  group My Group [0.5, 0.6, 30, 40] red black
  `
  const expected = {
    "My Group": {
      "cx": 0.6,
      "cy": 0.5,
      "name": "My Group",
      "type": "group",
      "rx": 40,
      "ry": 30,
      "fill": "red",
      "border": "black"
    },
    "__height": "400",
    "__width": "800",
  }

  expect(parseSpec(input.split("\n"))).toStrictEqual(expected);
});

