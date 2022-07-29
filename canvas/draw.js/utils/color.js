export const randomBelow = (n) => Math.floor(Math.random() * n);

export const randomColor = () => {
  const r = randomBelow(255);
  const g = randomBelow(255);
  const b = randomBelow(255);
  return `rgb(${r}, ${g}, ${b})`;
};
