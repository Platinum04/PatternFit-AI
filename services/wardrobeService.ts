import { SavedFit } from '../types';

const WARDROBE_STORAGE_KEY = 'patternfit_ai_wardrobe';
const MAX_WARDROBE_ITEMS = 20; // To prevent exceeding localStorage limits

/**
 * Retrieves all saved fits from localStorage.
 * @returns {SavedFit[]} An array of saved fitting sessions.
 */
export const getSavedFits = (): SavedFit[] => {
    try {
        const savedData = localStorage.getItem(WARDROBE_STORAGE_KEY);
        if (!savedData) return [];
        const fits: SavedFit[] = JSON.parse(savedData);
        // Basic validation
        if (Array.isArray(fits)) {
            return fits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return [];
    } catch (error) {
        console.error("Failed to parse saved fits from localStorage:", error);
        localStorage.removeItem(WARDROBE_STORAGE_KEY);
        return [];
    }
};

/**
 * Saves a new fitting session to localStorage.
 * Manages the size of the wardrobe to avoid exceeding storage limits.
 * @param {SavedFit} newFit The new fitting session to save.
 */
export const saveFit = (newFit: SavedFit): void => {
    try {
        const existingFits = getSavedFits();
        let updatedFits = [newFit, ...existingFits];
        
        // Enforce a limit on the number of saved items
        if (updatedFits.length > MAX_WARDROBE_ITEMS) {
            updatedFits = updatedFits.slice(0, MAX_WARDROBE_ITEMS);
        }
        
        localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(updatedFits));
    } catch (error) {
        console.error("Failed to save fit to localStorage:", error);
    }
};

/**
 * Deletes a specific fitting session from localStorage.
 * @param {string} fitId The ID of the fit to delete.
 */
export const deleteFit = (fitId: string): void => {
    try {
        const existingFits = getSavedFits();
        const updatedFits = existingFits.filter(fit => fit.id !== fitId);
        localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(updatedFits));
    } catch (error) {
        console.error("Failed to delete fit from localStorage:", error);
    }
};
