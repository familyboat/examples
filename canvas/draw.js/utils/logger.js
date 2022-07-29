class Logger {
  #prefix = null;

  constructor(klass) {
    this.#prefix = klass;
  }

  #cat(msg) {
    return `${this.#prefix}${msg}`;
  }

  error(message) {
    throw Error(this.#cat(message));
  }

  warn(message) {
    console.warn(this.#cat(message));
  }

  info(message) {
    console.info(this.#cat(message));
  }

  log(message) {
    console.log(this.#cat(message));
  }
}

export default Logger;
