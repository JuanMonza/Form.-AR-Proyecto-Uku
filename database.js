// js/database.js
import { supabase } from './supabaseClient.js';

/**
 * Sanitizes input by removing HTML tags to prevent XSS attacks.
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitize(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
}

export class Database {
    constructor() {
        // The constructor is no longer needed for localStorage.
        // The Supabase client is managed globally.
    }

    /**
     * Saves a new user to the Supabase database.
     * @param {object} userData - Contains nombre and telefono.
     * @returns {Promise<{data: object, error: object}>}
     */
    async saveUser(userData) {
        const nombreLimpio = sanitize(userData.nombre);
        const telefonoLimpio = sanitize(userData.telefono);

        if (!nombreLimpio || !telefonoLimpio) {
            return { data: null, error: { message: 'Nombre y teléfono son obligatorios.' } };
        }

        // Initialize progress for all species
        const initialProgress = {};
        for (let i = 1; i <= 9; i++) {
            const speciesId = `0${i}`.slice(-2);
            initialProgress[`QR_${speciesId}_Completado`] = false;
        }

        const { data, error } = await supabase
            .from('exploradores')
            .insert([
                { 
                    nombre_completo: nombreLimpio, 
                    telefono: telefonoLimpio,
                    progreso: initialProgress
                },
            ])
            .select()
            .single(); // .single() returns the inserted row as an object, not an array

        return { data, error };
    }

    /**
     * Retrieves a user from Supabase by their phone number.
     * @param {string} telefono The user's phone number.
     * @returns {Promise<object|null>} The user data or null if not found.
     */
    async getUser(telefono) {
        const telefonoLimpio = sanitize(telefono);
        if (!telefonoLimpio) return null;

        const { data, error } = await supabase
            .from('exploradores')
            .select('*')
            .eq('telefono', telefonoLimpio)
            .single(); // .single() is used because telefono is unique

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }
        return data;
    }

    /**
     * Updates a user's progress in the Supabase database.
     * @param {string} telefono The user's phone number.
     * @param {string} qrId The ID of the QR code scanned (e.g., 'QR_01_Completado').
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    async updateProgress(telefono, qrId) {
        const telefonoLimpio = sanitize(telefono);
        const qrIdLimpio = sanitize(qrId);

        if (!telefonoLimpio || !qrIdLimpio) return false;

        // 1. Get the user's current progress
        const user = await this.getUser(telefonoLimpio);
        if (!user) {
            console.error('Cannot update progress: user not found.');
            return false;
        }

        // 2. Update the progress object
        const newProgress = user.progreso || {};
        newProgress[qrIdLimpio] = true;

        // 3. Save the updated progress back to Supabase
        const { error } = await supabase
            .from('exploradores')
            .update({ progreso: newProgress })
            .eq('telefono', telefonoLimpio);

        if (error) {
            console.error('Error updating progress:', error);
            return false;
        }
        
        return true;
    }
}
