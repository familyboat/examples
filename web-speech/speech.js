import { log } from "./log.js";
import { hasIt, pop, removeChild } from "./util.js";
import { generateVoiceContent, populateVoiceList, voices } from "./voice.js";

// initialize
log("Initialize app");

const DEAD = "dead";
const STARTING = "starting";
const STARTED = "started";
const PAUSING = "pausing";
const PAUSED = "paused";
const RESUMING = "resuming";
const RESUMED = "resumed";
const CANCELING = "canceling";
const CANCELED = "canceled";

const speechForm = document.querySelector("#speech");
const speakBtn = document.querySelector("#speak");
const pauseBtn = document.querySelector("#pause");
const resumeBtn = document.querySelector("#resume");
const cancelBtn = document.querySelector("#cancel");

class Speak {
  constructor() {
    this.phase = DEAD;
    this.contentList = [];
    speakBtn.addEventListener("click", this.speak.bind(this));
    pauseBtn.addEventListener("click", this.pause.bind(this));
    resumeBtn.addEventListener("click", this.resume.bind(this));
    cancelBtn.addEventListener("click", this.cancel.bind(this));

    if (
      typeof speechSynthesis !== "undefined" &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    window.onbeforeunload = () => {
      cancelBtn.click();
    };

    this.init();
  }

  init() {
    // detect speechSynthesis functionality whether or not it is available
    let prefix = "speechSynthesis";
    if (!window.speechSynthesis) {
      log(hasIt(prefix, false));
      return;
    } else {
      log(hasIt(prefix, true));
    }

    prefix = "speak";
    if (!speechSynthesis.speak) {
      log(hasIt(prefix, false));
      removeChild(speakBtn);
    } else {
      log(hasIt(prefix, true));
    }

    prefix = "pause";
    if (!speechSynthesis.pause) {
      log(hasIt(prefix, false));
      removeChild(pauseBtn);
    } else {
      log(hasIt(prefix, true));
    }

    prefix = "resume";
    if (!speechSynthesis.resume) {
      log(hasIt(prefix, false));
      removeChild(resumeBtn);
    } else {
      log(hasIt(prefix, true));
    }

    prefix = "cancle";
    if (!speechSynthesis.cancel) {
      log(hasIt(prefix, false));
    } else {
      log(hasIt(prefix, true));
    }
  }

  getContent() {
    if (this.contentList.length) return pop(this.contentList);

    const fd = new FormData(speechForm);
    const content = fd.get("content") || "";
    this.contentList = content.split("\n");
    return pop(this.contentList)
  }

  getVoice() {
    const fd = new FormData(speechForm);
    return fd.get("currentVoice");
  }

  speak(event) {
    event.preventDefault();
    if (![DEAD, CANCELED].includes(this.phase)) return;
    const content = this.getContent();
    let voice = this.getVoice();
    if (content && voice) {
      log("Starting ...");
      this.phase = STARTING;

      for (const v of voices) {
        if (generateVoiceContent(v) === voice) {
          voice = v;
          break;
        }
      }

      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onerror = (e) => {
        log(`Error - ${e.error}`);
        this.clean();
      };

      utterance.onend = (e) => {
        const { elapsedTime } = e;
        if (this.contentList.length) {
          this.phase = DEAD;
          speakBtn.click();
          return
        }
        log(`End - elapsedTime: ${elapsedTime}`);
        this.clean();
      };

      speechSynthesis.speak(utterance);

      this.phase = STARTED;
    } else {
      log("content or voice is missing");
    }
  }

  pause(event) {
    event.preventDefault();
    if (![STARTED, RESUMED].includes(this.phase)) return;
    log("Pausing ...");
    this.phase = PAUSING;
    speechSynthesis.pause();
    this.phase = PAUSED;
  }

  resume(event) {
    event.preventDefault();
    if (![PAUSED].includes(this.phase)) return;
    log("Resuming ...");
    this.phase = RESUMING;
    speechSynthesis.resume();
    this.phase = RESUMED;
  }

  cancel(event) {
    event.preventDefault();
    if (![STARTED, RESUMED, PAUSED].includes(this.phase)) return;
    log("Canceling ...");
    this.phase = CANCELING;
    speechSynthesis.cancel();
    this.phase = CANCELED;
  }

  clean() {
    cancelBtn.click();
  }
}

new Speak();
