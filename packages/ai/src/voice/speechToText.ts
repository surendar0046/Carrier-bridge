export class SpeechToTextEngine {
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  listen(onResult: (text: string, isFinal: boolean) => void, onError?: (err: any) => void) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this environment.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      const isFinal = event.results[0].isFinal;
      onResult(transcript, isFinal);
    };

    if (onError) {
      this.recognition.onerror = onError;
    }

    this.recognition.start();
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
