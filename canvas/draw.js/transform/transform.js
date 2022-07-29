import { eulidLength, inclination, isCenterRotate, isCenterScale, toAngle } from "../utils/motion.js";

class Transform {
  #active = true;
  #emitter = null;
  // accept single pointer, dual pointer,
  // so store it in object
  #points = {};
  #activePointerId = null;

  #centerPoint = null;

  /**
   *
   * @param {EventEmitter} emitter emitter for recieving custom event
   */
  constructor(emitter) {
    this.#emitter = emitter;

    this.#onWheel();
    this.#onPointer();
  }

  #handlePointer() {
    const pointerIds = Object.keys(this.#points);
    const length = pointerIds.length;
    if (length === 1) {
      const pointerId = pointerIds[0];
      const points = this.#points[pointerId];
      const pointsLength = points.length;
      const { x: x1, y: y1 } = points[pointsLength - 2];
      const { x: x2, y: y2 } = points[pointsLength - 1];
      this.#emitter.emit("pan", {
        dx: x2 - x1,
        dy: y2 - y1,
      });
    } else if (length === 2) {
      let active;
      let inactive;
      Object.entries(this.#points).forEach(([pointerId, points]) => {
        if (pointerId == this.#activePointerId) {
          active = this.#points[pointerId];
        } else {
          inactive = this.#points[pointerId];
        }
      });
      const inactiveLength = inactive.length;
      const activeLength = active.length;
      const end1 = active[activeLength - 1];
      const end2 = active[activeLength - 2];
      if (inactiveLength === 1) {
        // center rotate
        const start = inactive[0];
        const theta1 = inclination(start, end1);
        const theta2 = inclination(start, end2);
        this.#emitter.emit('centerRotate', {
          cx: start.x,
          cy: start.y,
          angle: toAngle(theta1 - theta2),
        })
      } else {
        // center scale
        const start = inactive[0];
        const scale = eulidLength(start, end1) / eulidLength(start, end2);
        this.#emitter.emit('centerScale', {
          cx: start.x,
          cy: start.y,
          sx: scale,
          sy: scale,
        })
      }
    }
  }

  // for pan on desktop;
  // for pan, rotate and scale on mobile
  #onPointer() {
    const handler = (context) => {
      this.#centerPoint = null;
      const { type, pointerId } = context;

      // first valid pointer
      if (type === "pointerdown") {
        // create new pointer
        this.#points[pointerId] = [context];
      }
      if (type === "pointermove") {
        // check whether this pointer is valid firstly
        if (Object.keys(this.#points).length === 0) {
          // pass, do nothing
        } else {
          if (pointerId in this.#points) {
            // append pointer
            this.#activePointerId = pointerId;
            this.#points[pointerId].push(context);
            this.#handlePointer();
          }
        }
      }
      if (type === "pointerup") {
        // clear points
        this.#points = {};
      }
    };

    this.#emitter.on("pointer", handler);
  }

  // wheel is for center scale and center rotate
  #onWheel() {
    const handler = (context) => {
      const scale = isCenterScale(context);
      const rotate = isCenterRotate(context);
      if (scale || rotate) {
        const { deltaY } = context;

        if (this.#centerPoint === null) {
          const { x, y } = context;
          this.#centerPoint = {
            x,
            y,
          };
        }
        const { x, y } = this.#centerPoint;
        if (scale) {
          const scale = deltaY < 0 ? 1.1 : 0.9;

          this.#emitter.emit("centerScale", {
            cx: x,
            cy: y,
            sx: scale,
            sy: scale,
          });
        }
        if (rotate) {
          const angle = deltaY < 0 ? 10 : -10;

          this.#emitter.emit("centerRotate", {
            cx: x,
            cy: y,
            angle,
          });
        }
      }
    };

    this.#emitter.on("wheel", handler);
  }
}

export default Transform;
