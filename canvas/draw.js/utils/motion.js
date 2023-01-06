// ctrl key is for center scale
export const isCenterScale = (context) => {
  const { ctrlKey, shiftKey, altKey } = context;
  return ctrlKey && !shiftKey && !altKey;
};

// shift key is for center rotate
export const isCenterRotate = (context) => {
  const { ctrlKey, shiftKey, altKey } = context;
  return shiftKey && !ctrlKey && !altKey;
};

export const toRadian = angle => angle / 180 * Math.PI;
export const toAngle = radian => radian / Math.PI * 180;
export const euclidLength = (start, end) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// 当前坐标系直线的斜率
export const inclination = (start, end) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.atan2(dy, dx);
}
