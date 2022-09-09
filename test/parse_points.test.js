import { buildPoints } from "../lib/assets/js/main"
import expect from "expect";

test('Empty points is empty', () => {
  expect(buildPoints("")).toStrictEqual([])
});

test('One item is a single item list', () => {
  expect(buildPoints('0.48, 0.85')).toStrictEqual([{x: 0.85, y: 0.48}])
});

test('Multi item is a longer list', () => {
  expect(buildPoints('[0.43,0.49],[0.08,0.79]')).toStrictEqual([{x: 0.49, y: 0.43}, {x: 0.79, y: 0.08}])
});