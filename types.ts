export interface Fabric {
  id: string;
  name: string;
  imageUrl: string;
  base64?: string;
  mimeType?: string;
}

export type Gender = 'male' | 'female';

export type SleeveLength = 'short' | 'long';

export interface Style {
  id: string;
  name: string;
  gender: Gender;
  imageUrl: string; 
}

export interface Design {
  id: string;
  name: string;
  styleId: string; // Links to a Style (e.g., 'agbada')
  imageUrl: string; // Will be a data URI
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

export interface AITailorFeedback {
  overallImpression: string;
  fitAnalysis: string;
  fabricChoice: string;
  styleTip: string;
}


export enum AppStep {
  SELECTION = 1,
  PROCESSING = 2,
  RESULTS = 3,
}

export interface SavedFit {
  id: string; // Unique ID, e.g., timestamp
  style: Style;
  fabric: Fabric;
  design: Design; // Added the selected design
  sleeveLength: SleeveLength;
  measurements: Measurements;
  feedback: AITailorFeedback;
  userImage: {
    base64: string;
    mimeType: string;
  };
  generatedImageBase64: string;
  createdAt: string;
}