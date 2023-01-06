import { average, deriation, std, sum } from "./statistic.js";
import { expect } from "./test.js";


export const test = () => {
  const sample = [1, 2, 3, 4, 5];
  expect(sum(sample), 15);
  expect(average(sample), 3);
  expect(deriation(sample), 2);
  expect(std(sample), Math.SQRT2)
}