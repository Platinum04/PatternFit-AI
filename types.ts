// FIX: Removed self-import of `Style` which was causing a conflict with the local declaration.

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
  // Common to Male & Female
  shoulder?: number;
  bust?: number; // Represented as Chest for males
  waist?: number;
  hip?: number;
  sleeve?: number;
  lap?: number;
  trouserLength?: number;
  
  // Female-specific
  halfLength?: number;
  bustPoint?: number;
  shoulderToUnderBust?: number;
  shoulderToWaist?: number;
  skirtLength?: number;
  shirtLength?: number;
  nippleToNipple?: number;
}


export enum AppStep {
  SELECTION = 1,
  PROCESSING = 2,
  RESULTS = 3,
}