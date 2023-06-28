// log function
const elementLog = document.querySelector("#log");
let index = 0;
export function log(message) {
  if (typeof message !== "string") return;
  if (!message) return;
  const li = document.createElement("li");
  const text = document.createTextNode("#" + index++ + ": " + message + `(${new Date().toLocaleString()})`);
  li.appendChild(text);
  elementLog.appendChild(li);
}