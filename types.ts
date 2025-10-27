export interface Fabric {
  id: string;
  name: string;
  imageUrl: string;
  base64?: string;
  mimeType?: string;
}

export type Gender = 'male' | 'female';

export interface Style {
  id: string;
  name: string;
  gender: Gender;
  imageUrl: string; 
}

export interface Measurements {
  chest: number;
  waist: number;
  hip: number;
}

export enum AppStep {
  SELECTION = 1,
  PROCESSING = 2,
  RESULTS = 3,
}
