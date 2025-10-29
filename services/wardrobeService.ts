import { SavedFit } from '../types';

const WARDROBE_STORAGE_KEY = 'patternfit_ai_wardrobe';
const MAX_WARDROBE_ITEMS = 10; // Reduced to prevent exceeding localStorage limits

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
    const existingFits = getSavedFits();
    let updatedFits = [newFit, ...existingFits];
    
    // Enforce a limit on the number of saved items
    if (updatedFits.length > MAX_WARDROBE_ITEMS) {
        updatedFits = updatedFits.slice(0, MAX_WARDROBE_ITEMS);
    }
    
    try {
        localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(updatedFits));
    } catch (error) {
        console.error("Failed to save fit to localStorage:", error);
        // Check if it's a quota error and attempt to recover
        if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
            console.warn("Quota exceeded. Removing oldest fit and retrying.");
            // Remove the oldest item and try to save again
            if (updatedFits.length > 1) {
                const trimmedFits = updatedFits.slice(0, updatedFits.length - 1);
                try {
                    localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(trimmedFits));
                } catch (retryError) {
                    console.error("Failed to save fit even after trimming:", retryError);
                    alert("Your wardrobe is full! The oldest item was removed, but there still isn't enough space to save the new design.");
                }
            } else {
                alert("Your wardrobe is full and the new design could not be saved.");
            }
        }
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
