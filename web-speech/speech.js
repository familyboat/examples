import { log } from "./log.js";
import { hasIt, removeChild } from "./util.js";
import { generateVoiceContent, populateVoiceList, voices } from "./voice.js";

// initialize
log("Initialize app");

const DEAD = "dead";
const STARTING = "starting";
const STARTED = "started";
const CANCELING = "canceling";
const CANCELED = "canceled";

const speechForm = document.querySelector("#speech");
const speakBtn = document.querySelector("#speak");

class Speak {
  constructor() {
    this.phase = DEAD;
    this.timer = null;
    this.contentList = [];
    // length of this.contentList
    this.len = null;
    this.rowId = -1;
    speakBtn.addEventListener("click", this.start.bind(this));

    if (
      typeof speechSynthesis !== "undefined" &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    window.onbeforeunload = () => {
      this.cancel();
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

    prefix = "cancle";
    if (!speechSynthesis.cancel) {
      log(hasIt(prefix, false));
    } else {
      log(hasIt(prefix, true));
    }
  }

  getContent() {
    // new content
    if (this.rowId === -1) {
      const fd = new FormData(speechForm);
      const content = fd.get("content") || "";
      this.contentList = content.split("\n").filter((s) => s);
      this.len = this.contentList.length;
    }

    // has content
    if (this.len && (this.rowId + 1) < this.len) {
      this.rowId++;
      return this.contentList[this.rowId];
    } else {
      return "";
    }
  }

  getVoice() {
    const fd = new FormData(speechForm);
    return fd.get("currentVoice");
  }

  speak() {
    const content = this.getContent();
    const voice = this.getVoice();
    if (content && voice) {
      speakBtn.textContent = "stop";
      if (!this.rowId || this.phase === CANCELED) log("Starting ...");
      this.phase = STARTING;

      const utterance = new SpeechSynthesisUtterance(content);
      for (const v of voices) {
        if (generateVoiceContent(v) === voice) {
          utterance.voice = v;
          break;
        }
      }

      utterance.onend = (e) => {
        this.phase = DEAD;
        const { elapsedTime } = e;
        // there is content to read
        if ((this.rowId + 1) < this.len) {
          speakBtn.click();
        } else {
          log(`End - elapsedTime: ${elapsedTime}`);
          this.clean();
          this.cleanTimer();
        }
      };

      speechSynthesis.speak(utterance);

      this.phase = STARTED;
      this.poll();
    } else {
      log("content or voice is missing");
    }
  }

  cancel() {
    speakBtn.textContent = "speak";
    log("Canceling ...");
    this.phase = CANCELING;
    speechSynthesis.cancel();
    this.phase = CANCELED;
    this.rowId--;
    this.cleanTimer();
  }

  start(event) {
    event.preventDefault();
    // speaking now, so should switch it to not speaking
    if (this.phase === STARTED) {
      this.cancel();
    } // not speaking now, so should switch it to speaking
    else if ([DEAD, CANCELED].includes(this.phase)) {
      this.speak();
    }
  }

  poll() {
    if (this.timer) return;
    this.timer = setInterval(async () => {
      await fetch("/");
    }, 1000);
  }

  // this.contentList is over
  // speaing is over
  clean() {
    this.contentList.length = 0;
    this.len = null;
    this.rowId = -1;
    speakBtn.textContent = "speak";
  }

  cleanTimer() {
    if (this.timer) {
      log("cleaning timer ...");
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

new Speak();
