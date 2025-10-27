import { Measurements, Gender } from '../types';

// Simulates a computer vision model to calculate body measurements.
export const calculateMeasurements = async (heightInInches: number, gender: Gender): Promise<Measurements> => {
  console.log(`Simulating measurements for height: ${heightInInches} inches, gender: ${gender}`);
  
  // Simulate network delay and processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Base estimations - these are very rough for demonstration purposes.
  const waist = heightInInches * 0.45 + (Math.random() - 0.5) * 2;
  const hip = waist * (gender === 'female' ? 1.2 : 1.1) + (Math.random() - 0.5) * 2;
  const bust = hip * (gender === 'female' ? 0.98 : 0.95) + (Math.random() - 0.5) * 2;
  const shoulder = heightInInches * 0.23 + (Math.random() - 0.5);
  const sleeve = heightInInches * 0.33 + (Math.random() - 0.5);

  let measurements: Measurements = {};

  if (gender === 'male') {
    // For men, we use a specific set of measurements as requested.
    measurements = {
      shoulder: parseFloat(shoulder.toFixed(1)),
      sleeve: parseFloat(sleeve.toFixed(1)),
      bust: parseFloat(bust.toFixed(1)), // Labeled as 'Chest' in UI
      trouserLength: parseFloat((heightInInches * 0.6).toFixed(1)),
      lap: parseFloat((hip * 0.6).toFixed(1)),
    };
  } else {
    // For women, we use a single comprehensive set of measurements
    const femaleMeasurements: Measurements = {
      shoulder: parseFloat(shoulder.toFixed(1)),
      bust: parseFloat(bust.toFixed(1)),
      waist: parseFloat(waist.toFixed(1)),
      hip: parseFloat(hip.toFixed(1)),
      sleeve: parseFloat(sleeve.toFixed(1)),
      lap: parseFloat((hip * 0.6).toFixed(1)),
      halfLength: parseFloat((heightInInches * 0.28).toFixed(1)),
      bustPoint: parseFloat((bust * 0.4).toFixed(1)),
      shoulderToUnderBust: parseFloat((heightInInches * 0.22).toFixed(1)),
      shoulderToWaist: parseFloat((heightInInches * 0.25).toFixed(1)),
      skirtLength: parseFloat((heightInInches * 0.4).toFixed(1)),
      shirtLength: parseFloat((heightInInches * 0.35).toFixed(1)),
      nippleToNipple: parseFloat((bust * 0.21).toFixed(1)),
      trouserLength: parseFloat((heightInInches * 0.6).toFixed(1)),
    };
    measurements = femaleMeasurements;
  }


  console.log('Simulated measurements:', measurements);
  return measurements;
};
