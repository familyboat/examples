import { randomColor } from "../utils/color.js";
import Logger from "../utils/logger.js";
import Line from "./line.js";
import { IDENTITY_TRANSFORM } from "../utils/constant.js";

class BaseLine {
  lines = [];
  startPoint = null;
  endPoint = null;
  eventEmitter = null;
  points = [];
  active = true;
  contextOptions = null;

  constructor({ emitter, ...contextOptions }) {
    this.eventEmitter = emitter;
    this.contextOptions = contextOptions;
  }

  addLine() {
    const { x: x1, y: y1 } = this.startPoint;
    const { x: x2, y: y2 } = this.endPoint;
    const line = new Line(x1, y1, x2, y2);
    this.lines.push(line);
    this.eventEmitter.emit("requestDrawingAll");
  }

  draw(context) {
    if (!(context instanceof CanvasRenderingContext2D)) {
      this.logger.error(
        `context should be valid canvas rendering context, but got ${context}.`
      );
    }
    if (this.contextOptions.lineWidth < 0.1) return;

    context.save();
    Object.entries(this.contextOptions).forEach(([key, value]) => {
      context[key] = value;
    });
    context.setTransform(...IDENTITY_TRANSFORM);
    context.beginPath();
    this.lines.forEach((line, index) => {
      const { x: x1, y: y1 } = line.startPoint;
      const { x: x2, y: y2 } = line.endPoint;
      if (index === 0) {
        context.moveTo(x1, y1);
      }
      context.lineTo(x2, y2);
    });
    context.stroke();
    context.restore();
  }
  pan(dx, dy) {
    this.lines.forEach((line) => line.pan(dx, dy));
  }

  centerScale(cx, cy, sx, sy) {
    // sx is equal to sy
    const { lineWidth } = this.contextOptions;
    this.contextOptions.lineWidth = lineWidth * sx;
    this.lines.forEach((line) => line.centerScale(cx, cy, sx, sy));
  }

  centerRotate(cx, cy, angle) {
    this.lines.forEach((line) => line.centerRotate(cx, cy, angle));
  }

  off() {
    this.eventEmitter.off("shape");
  }
}

/**
 * just ordinary line
 */
class DefaultLine extends BaseLine {
  logger = new Logger("class default line: ");

  /**
   *
   * @param {EventEmitter} emitter emitter for recieving custom event
   */
  constructor(options) {
    super(options);

    // listen 'pointer' event
    this.#onPointer();
  }

  #onPointer() {
    const handler = (context) => {
      const { pointerId, type } = context;

      if (this.startPoint === null) {
        this.startPoint = context;
        this.points.push(context);
      } else {
        // just one pointer source
        if (this.startPoint.pointerId !== pointerId) {
          return;
        }
        if (this.endPoint === null) {
          this.endPoint = context;
          this.addLine();
        } else {
          const { x, y } = context;
          this.lines.forEach((line) => line.update(x, y));
          this.eventEmitter.emit("requestDrawingAll");
        }
      }

      if (type === "pointerup") {
        this.active = false;
        this.eventEmitter.emit("done");
      }
    };
    this.eventEmitter.on("shape", handler);
  }
}

/**
 * multi line
 */
class MultiLine extends BaseLine {
  logger = new Logger("class multi line: ");

  constructor(options) {
    super(options);

    this.#onPointer();
  }

  #onPointer() {
    const handler = (context) => {
      const { type, pointerId } = context;
      if (this.startPoint === null) {
        this.startPoint = context;
        this.points.push(context);
      } else {
        if (pointerId !== this.startPoint.pointerId) {
          return;
        }
        if (this.endPoint === null) {
          this.endPoint = context;
          this.addLine();
        } else {
          this.startPoint = this.endPoint;
          this.endPoint = context;
          this.addLine();
        }
      }

      if (type === "pointerup") {
        this.active = false;
        this.eventEmitter.emit("done");
      }
    };

    this.eventEmitter.on("shape", handler);
  }
}

export { DefaultLine, MultiLine };
