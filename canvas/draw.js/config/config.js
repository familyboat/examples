import Logger from "../utils/logger.js";

class Config {
  #root = null;
  #eventEmitter = null;
  #logger = new Logger("class config: ");

  constructor(element, eventEmitter) {
    if (!(element instanceof HTMLElement)) {
      this.#logger.error(`element should be valid html element, 
        but got ${element}
      `);
    }
    this.#eventEmitter = eventEmitter;
    this.#root = element;
    this.#init();
  }

  #init() {
    this.#initShape();
    this.#initExport();
    this.#initShare();
    this.#initStyle();
  }

  #initShape() {
    const shape = this.#root.querySelector("#shape");
    if (!shape) return;
    shape.addEventListener("click", (event) => {
      const { target, currentTarget } = event;
      const isItem = target.classList.contains("item");
      if (!isItem) return;
      const isActive = target.classList.contains("item--active");
      const type = target.dataset.type;
      const items = currentTarget.querySelectorAll(".item");
      items.forEach((item) => {
        item.classList.remove("item--active");
      });
      !isActive && target.classList.add("item--active");
      this.#eventEmitter.emit("config", {
        type: isActive ? null : type,
      });
    });
  }

  #initExport() {
    const exportBtn = this.#root.querySelector("#export");
    if (!exportBtn) return;
    exportBtn.addEventListener("click", () => {
      exportBtn.textContent = "exporting";
      exportBtn.disabled = true;
      this.#eventEmitter.emit("export");
    });
    this.#eventEmitter.on("exported", () => {
      exportBtn.textContent = "export png";
      exportBtn.removeAttribute("disabled");
    });
  }

  #initShare() {
    const shareBtn = this.#root.querySelector("#share");
    if (!shareBtn) return;
    if (!('share' in navigator)) {
      shareBtn.classList.add('button--hidden');
    }
    shareBtn.addEventListener("click", () => {
      shareBtn.textContent = "sharing";
      shareBtn.disabled = true;
      this.#eventEmitter.emit("share");
    });
    this.#eventEmitter.on("shared", () => {
      shareBtn.textContent = "share png";
      shareBtn.removeAttribute("disabled");
    });
  }

  #initStyle() {
    const lineWidth = this.#root.querySelector('#lineWidth');
    const strokeStyle = this.#root.querySelector('#strokeStyle');
    if (lineWidth) {
      lineWidth.addEventListener('change', (event) => {
        const { target } = event;
        const min = +target.min;
        const max = +target.max;
        const value = +target.value;
        if (min <= value && value <= max) {
          this.#eventEmitter.emit('config', {
            lineWidth: value
          });
        }
      });
    }
    if (strokeStyle) {
      strokeStyle.addEventListener('change', (event) => {
        const value = event.target.value;
        this.#eventEmitter.emit('config', {
          strokeStyle: value
        });
      });
    }
  }
}
export default Config;
