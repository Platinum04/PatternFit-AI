import { Fabric } from '../types';

const STORAGE_KEY = 'patternfit_ai_saved_fabrics';

/**
 * Retrieves saved fabrics from localStorage.
 * @returns {Fabric[]} An array of saved fabric objects.
 */
export const getSavedFabrics = (): Fabric[] => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return [];
    
    const fabrics: Fabric[] = JSON.parse(savedData);
    // Basic validation to ensure it's an array and has the expected structure
    if (Array.isArray(fabrics) && fabrics.every(f => f.id && f.name && f.base64 && f.mimeType)) {
      // Re-create blob URLs for images upon loading
      fabrics.forEach(fabric => {
        const byteCharacters = atob(fabric.base64!);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fabric.mimeType! });
        fabric.imageUrl = URL.createObjectURL(blob);
      });
      return fabrics;
    }
    return [];
  } catch (error) {
    console.error("Failed to parse saved fabrics from localStorage:", error);
    // If parsing fails, clear the corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

/**
 * Saves an array of fabrics to localStorage.
 * @param {Fabric[]} fabrics The array of fabrics to save.
 */
export const saveFabrics = (fabrics: Fabric[]): void => {
  try {
    // We only need to store the raw data, not the blob URL
    const dataToSave = JSON.stringify(fabrics.map(({ id, name, base64, mimeType }) => ({ id, name, base64, mimeType })));
    localStorage.setItem(STORAGE_KEY, dataToSave);
  } catch (error) {
    console.error("Failed to save fabrics to localStorage:", error);
  }
};
