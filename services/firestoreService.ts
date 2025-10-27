import { Style, Fabric, Measurements } from '../types';

interface FitData {
  styleId: string;
  styleName: string;
  fabricId: string;
  fabricName: string;
  measurements: Measurements;
  createdAt: string;
}

// Mocks saving data to Firebase Firestore.
export const saveFitData = async (data: { style: Style, fabric: Fabric, measurements: Measurements }): Promise<void> => {
  const fitData: FitData = {
    styleId: data.style.id,
    styleName: data.style.name,
    fabricId: data.fabric.id,
    fabricName: data.fabric.name,
    measurements: data.measurements,
    createdAt: new Date().toISOString(),
  };

  console.log('Simulating save to Firestore:', fitData);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Data saved successfully (mocked).');
};
