// Speech Synthesis Service Layer for WonderVerse
let voices = [];

function getBestVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  voices = window.speechSynthesis.getVoices();
  
  // Filter for English voices
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  
  // Try to find a natural/high-quality English voice
  const preferredNames = [
    'Google US English',
    'Microsoft Aria',
    'Microsoft Guy',
    'Microsoft Zira',
    'Microsoft David',
    'en-US',
    'en-GB'
  ];
  
  for (const name of preferredNames) {
    const found = englishVoices.find(v => v.name.includes(name) || v.lang === name);
    if (found) return found;
  }
  
  if (englishVoices.length > 0) return englishVoices[0];
  if (voices.length > 0) return voices[0];
  return null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  // Populate voices list when loaded
  window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
  };
  // Initial populate
  voices = window.speechSynthesis.getVoices();
}

let currentUtterance = null;
let currentOnStart = null;
let currentOnEnd = null;
let isSpeakingState = false;

export const VoiceService = {
  speak(text, onStart, onEnd, onError) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onError) onError(new Error("Speech synthesis not supported in this browser"));
      return;
    }

    // Cancel any ongoing speech first
    this.stop();

    // Strip HTML tags from text
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = 1.0;
    utterance.rate = 1.0;

    currentUtterance = utterance;
    currentOnStart = onStart;
    currentOnEnd = onEnd;
    isSpeakingState = true;

    utterance.onstart = () => {
      if (currentOnStart) {
        currentOnStart();
      }
      window.dispatchEvent(new CustomEvent("voice-speak-start", { detail: { text: cleanText } }));
    };

    const handleEnd = () => {
      if (!isSpeakingState) return;
      isSpeakingState = false;
      if (currentOnEnd) {
        const tempEnd = currentOnEnd;
        currentOnEnd = null;
        tempEnd();
      }
      currentUtterance = null;
      currentOnStart = null;
      window.dispatchEvent(new CustomEvent("voice-speak-end"));
    };

    utterance.onend = handleEnd;

    utterance.onerror = (event) => {
      console.warn("SpeechSynthesisUtterance warning/error", event);
      // 'interrupted' is fired when cancel() is called. We handle cancel inside stop().
      if (event.error !== 'interrupted') {
        isSpeakingState = false;
        if (onError) onError(event);
        if (currentOnEnd) {
          const tempEnd = currentOnEnd;
          currentOnEnd = null;
          tempEnd();
        }
        currentUtterance = null;
        currentOnStart = null;
        window.dispatchEvent(new CustomEvent("voice-speak-end"));
      }
    };

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeakingState) {
      isSpeakingState = false;
      window.speechSynthesis.cancel();
      
      if (currentOnEnd) {
        const tempEnd = currentOnEnd;
        currentOnEnd = null;
        tempEnd();
      }
      
      currentUtterance = null;
      currentOnStart = null;
      window.dispatchEvent(new CustomEvent("voice-speak-end"));
    } else {
      // Fallback: force cancel to reset the speech synthesis engine
      window.speechSynthesis.cancel();
    }
  },

  pause() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
  },

  resume() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
  },

  isPlaying() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;
    return isSpeakingState || window.speechSynthesis.speaking;
  }
};

export default VoiceService;
