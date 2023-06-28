export const voices = [];

const voiceSelect = document.querySelector("#voiceList");

export function generateVoiceContent(voice) {
  const { name, lang, default: d } = voice;
  let content = `${name} (${lang})`;
  if (d) {
    content += " - DEFAULT";
  }
  return content;
}

export function populateVoiceList() {
  if (typeof speechSynthesis === "undefined") {
    return;
  }

  voices.length = 0;
  voices.push(...speechSynthesis.getVoices());

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    const voice = voices[i];
    option.value = generateVoiceContent(voice);

    voiceSelect.appendChild(option);
  }
}