import { IDENTITY_TRANSFORM } from "../utils/constant.js";
import Logger from "../utils/logger.js";

class Canvas {
  #canvas = null;
  #context = null;
  #logger = new Logger('class canvas')
  #objects = [];

  constructor(canvas) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      this.#logger.error(`canvas should be HTMLCanvasElement, 
        but got ${canvas}
      `);
    }

    // initialize canvas
    this.#canvas = canvas;
    this.#init();
    this.#context = canvas.getContext("2d");
  }

  #init() {
    const { width, height } = this.#canvas.getBoundingClientRect();
    this.#canvas.width = width;
    this.#canvas.height = height;
  }

  add(shape) {
    this.#objects.push(shape);
  }

  requestDrawingAll() {
    this.clearCanvas();
    for (const shape of this.#objects) {
      shape.draw(this.#context);
    }
  }

  resize() {
    this.#init();
  }

  pan(dx, dy) {
    for (const shape of this.#objects) {
      shape.pan(dx, dy);
    }
  }

  centerScale(cx, cy, sx, sy) {
    for (const shape of this.#objects) {
      shape.centerScale(cx, cy, sx, sy);
    }
  }

  centerRotate(cx, cy, angle) {
    for (const shape of this.#objects) {
      shape.centerRotate(cx, cy, angle);
    }
  }

  clearCanvas() {
    const { width, height } = this.#canvas;
    this.#context.setTransform(...IDENTITY_TRANSFORM);
    this.#context.clearRect(0, 0, width, height);
  }
}

export default Canvas;
