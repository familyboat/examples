import Logger from "../utils/logger.js";
import { isNumber } from "../utils/type.js";

class Point {
  #x = null;
  #y = null;
  #logger = new Logger('class point: ')

  constructor(x, y) {
    if (!isNumber(x) || !isNumber(y)) {
      this.#logger.error(`point's coordinate should be valid number, 
        but got x -> ${x}, y -> ${y}
      `)
    }
    this.#x = x;
    this.#y = y;
  }

  pan(dx, dy) {
    this.#x += dx;
    this.#y += dy;
    return this;
  }

  scale(sx, sy) {
    this.#x *= sx;
    this.#y *= sy;
    return this;
  }

  rotate(angle) {
    const radian = (Math.PI / 180) * angle;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    const x = this.#x;
    const y = this.#y;
    this.#x = x * cos - y * sin;
    this.#y = x * sin + y * cos;
    return this;
  }

  update(x, y) {
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
}

export default Point;