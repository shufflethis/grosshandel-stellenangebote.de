export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Vollzeit' | 'Teilzeit' | 'Ausbildung';
  salary: string;
  postedAt: string;
  description: string;
}

export enum Page {
  HOME = 'home',
  JOBS = 'jobs',
  EMPLOYERS = 'employers',
  ABOUT = 'about',
  IMPRESSUM = 'impressum'
}

export interface AudioUtils {
  createBlob: (data: Float32Array) => Blob;
  decodeAudioData: (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => Promise<AudioBuffer>;
  decode: (base64: string) => Uint8Array;
  encode: (bytes: Uint8Array) => string;
}