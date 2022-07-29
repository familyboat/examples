import Canvas from "./canvas/canvas.js";
import Config from "./config/config.js";
import { DefaultLine, MultiLine } from "./shape/shape.js";
import Transform from "./transform/transform.js";
import { download, share } from "./utils/downlaod.js";
import EventEmitter from "./vendor/eventEmitter.js";

class Draw {
  static #availableShape = {
    line: DefaultLine,
    multiline: MultiLine,
  };

  #config = {
    lineWidth: 1,
    lineJoin: 'round',
    strokeStyle: '#000000',
  };
  #canvas = null;
  #canvasManager = null;
  #eventEmitter = new EventEmitter();
  #activeElement = null;
  #transformElement = new Transform(this.#eventEmitter);

  constructor(canvas, config) {
    this.#canvasManager = new Canvas(canvas);
    new Config(config, this.#eventEmitter);
    this.#canvas = canvas;

    this.#init();
  }

  #init() {
    window.addEventListener("resize", () => {
      this.#canvasManager.resize();
      this.#canvasManager.requestDrawingAll();
    });

    const handler = (event) => {
      const { type } = event;
      const { type: configType, newShape } = this.#config;
      if (configType) {
        // shape mode
        if ((!this.#activeElement || newShape) && type === "pointerdown") {
          this.#activeElement && this.#activeElement.off();
          this.#createNewShape();
        }
        if (this.#activeElement) {
          this.#eventEmitter.emit("shape", event);
        }
      } else {
        // transform mode
        this.#eventEmitter.emit("pointer", event);
      }
    };

    this.#canvas.addEventListener("pointerdown", handler, false);
    this.#canvas.addEventListener("pointermove", handler, false);
    this.#canvas.addEventListener("pointerup", handler, false);

    this.#canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const configType = this.#config.type;
      if (!configType) {
        // transform mode
        this.#eventEmitter.emit("wheel", event);
      }
    });

    this.#eventEmitter.on("config", (config) => {
      this.#config = {
        ...this.#config,
        ...config,
      };
      const { type } = this.#config;
      if (type && !config.type) {
        // shape mode and change line width or stroke style
        // so i should create new shape
        this.#config.newShape = true;
      } else {
        this.#config.newShape = false;
      }
    });

    this.#eventEmitter.on("done", () => {
      this.#activeElement.off();
      this.#activeElement = null;
    });

    this.#eventEmitter.on("pan", ({ dx, dy }) => {
      this.#canvasManager.pan(dx, dy);
      this.#canvasManager.requestDrawingAll();
    });

    this.#eventEmitter.on("centerScale", ({ cx, cy, sx, sy }) => {
      this.#canvasManager.centerScale(cx, cy, sx, sy);
      this.#canvasManager.requestDrawingAll();
    });

    this.#eventEmitter.on("centerRotate", ({ cx, cy, angle }) => {
      this.#canvasManager.centerRotate(cx, cy, angle);
      this.#canvasManager.requestDrawingAll();
    });

    this.#eventEmitter.on("requestDrawingAll", () => {
      this.#canvasManager.requestDrawingAll();
    });

    this.#eventEmitter.on("export", () => {
      this.#canvas.toBlob((blob) => {
        download(blob);
        this.#eventEmitter.emit("exported");
      });
    });

    this.#eventEmitter.on("share", () => {
      this.#canvas.toBlob((blob) => {
        share(blob);
        this.#eventEmitter.emit("shared");
      });
    });
  }

  #createNewShape() {
    const { type: configType, ...contextOptions } = this.#config;
    const shape = new Draw.#availableShape[configType]({
      emitter: this.#eventEmitter,
      ...contextOptions,
    }

    );
    this.#activeElement = shape;
    this.#canvasManager.add(shape);
  }
}

export default Draw;
