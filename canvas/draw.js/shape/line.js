import Logger from "../utils/logger.js";
import Point from "./point.js";

class Line {
  #startPoint = null;
  #endPoint = null;
  #type = "line";
  #logger = new Logger("class Line: ");

  constructor(x1, y1, x2, y2) {
    this.#startPoint = new Point(x1, y1);
    this.#endPoint = new Point(x2, y2);
  }

  pan(dx, dy) {
    this.#startPoint.pan(dx, dy);
    this.#endPoint.pan(dx, dy);
  }

  centerScale(cx, cy, sx, sy) {
    this.#startPoint.pan(-cx, -cy).scale(sx, sy).pan(cx, cy);
    this.#endPoint.pan(-cx, -cy).scale(sx, sy).pan(cx, cy);
  }

  centerRotate(cx, cy, angle) {
    this.#startPoint.pan(-cx, -cy).rotate(angle).pan(cx, cy);
    this.#endPoint.pan(-cx, -cy).rotate(angle).pan(cx, cy);
  }

  update(x, y) {
    this.#endPoint.update(x, y);
  }

  get startPoint() {
    return this.#startPoint;
  }

  get endPoint() {
    return this.#endPoint;
  }
}

export default Line;
