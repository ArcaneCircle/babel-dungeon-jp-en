import { LANG1_CODE } from "~/lib/constants";

let voice = getVoice();

function getVoice() {
  try {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(
        (voice) => voice.lang.split("-")[0].split("_")[0] === LANG1_CODE,
      ) || null
    );
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function tts(text: string) {
  try {
    if (!voice) voice = getVoice();
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    if (voice) {
      msg.voice = voice;
    } else {
      msg.lang = LANG1_CODE;
    }
    window.speechSynthesis.speak(msg);
  } catch (e) {
    console.log(e);
  }
}
