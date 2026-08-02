export interface VoiceCommand {
  keyword: string;
  action: string;
  target?: string;
}

export const defaultVoiceCommands: VoiceCommand[] = [
  { keyword: 'open dashboard', action: 'NAVIGATE', target: '/dashboard' },
  { keyword: 'show jobs', action: 'NAVIGATE', target: '/jobs' },
  { keyword: 'find mentor', action: 'NAVIGATE', target: '/mentor' },
  { keyword: 'check resume', action: 'NAVIGATE', target: '/resume' },
  { keyword: 'explore courses', action: 'NAVIGATE', target: '/courses' },
];

export class VoiceCommandProcessor {
  processCommand(transcript: string): VoiceCommand | null {
    const clean = transcript.toLowerCase().trim();
    for (const cmd of defaultVoiceCommands) {
      if (clean.includes(cmd.keyword)) {
        return cmd;
      }
    }
    return null;
  }
}
