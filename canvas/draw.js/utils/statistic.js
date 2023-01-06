import { euclidLength } from "./motion.js";

export const sum = (numList) => {
  let sum = 0;
  numList.forEach(num => {
    sum += num;
  });
  return sum;
}

export const average = (numList) => {
  const length = numList.length;
  const sumResult = sum(numList);
  return sumResult / length
}

export const deriation = (numList) => {
  let sum = 0;
  const length = numList.length;
  const avg = average(numList);
  numList.forEach(num => {
    sum += num * num;
  });
  return sum / length - avg * avg
}

export const std = (numList) => Math.sqrt(deriation(numList))

export const isFixedPoint = (pointList, limit) => {
  const startPoint = pointList[0];
  pointList.forEach((point, index) => {
    if (index === 0) {
      return 0
    }
    return euclidLength(startPoint, point)
  });
  const avg = average(pointList);
  const stdd = std(numList);
  const result = {
    startPoint: startPoint,
    average: avg,
    std: stdd
  }
  if (stdd < limit) {
    return {
      ...result,
      isFixedPoint: true,
    }
  }
  return {
    ...result,
    isFixedPoint: false,
  }
}
