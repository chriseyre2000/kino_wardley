import { buildPoints } from "../lib/assets/js/main"
import expect from "expect";

test('Empty points is empty', () => {
  expect(buildPoints("")).toStrictEqual([])
});

test('One item is a single item list', () => {
  expect(buildPoints('0.48, 0.85')).toStrictEqual([{x: 0.48, y: 0.85}])
});

test('Multi item is a longer list', () => {
  expect(buildPoints('[0.43,0.49],[0.08,0.79]')).toStrictEqual([{x: 0.43, y: 0.49}, {x: 0.08, y: 0.79}])
});