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

/**
 * Normalizes text by removing accents and special characters.
 * @param {string} str The string to normalize.
 * @returns {string} The normalized string.
 */
function normalizeText(str) {
    if (!str) return '';
    
    // Remover tags HTML y scripts
    str = str.replace(/<[^>]*>?/gm, '');
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remover caracteres peligrosos
    str = str.replace(/[<>\"'`]/g, '');
    
    // Limitar longitud máxima
    str = str.substring(0, 100);
    
    // Convertir a minúsculas y remover acentos
    const normalized = str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    // Capitalizar primera letra de cada palabra
    return normalized.split(' ')
        .filter(word => word.length > 0) // Remover espacios múltiples
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim();
}

/**
 * Sanitizes and validates phone number.
 * @param {string} phone The phone number to sanitize.
 * @returns {string} The sanitized phone number (only digits).
 */
function sanitizePhone(phone) {
    if (!phone) return '';
    // Solo números, remover todo lo demás
    const cleaned = phone.replace(/[^0-9]/g, '');
    // Limitar longitud máxima a 15 dígitos (estándar internacional)
    return cleaned.substring(0, 15);
}

export class Database {
    constructor() {
        // The constructor is no longer needed for localStorage.
        // The Supabase client is managed globally.
    }

    /**
     * Saves a new user to the Supabase database.
     * @param {object} userData - Contains nombre, telefono, and ciudad.
     * @returns {Promise<{data: object, error: object}>}
     */
    async saveUser(userData) {
        // Normalizar nombre (sin acentos, sin caracteres especiales)
        const nombreLimpio = normalizeText(userData.nombre);
        // Sanitizar teléfono (solo números)
        const telefonoLimpio = sanitizePhone(userData.telefono);
        // Normalizar ciudad
        const ciudadLimpia = normalizeText(userData.ciudad);

        console.log('📝 Intentando guardar usuario:', { 
            nombreOriginal: userData.nombre,
            nombreNormalizado: nombreLimpio, 
            telefonoOriginal: userData.telefono,
            telefonoLimpio: telefonoLimpio,
            ciudadOriginal: userData.ciudad,
            ciudadNormalizada: ciudadLimpia
        });

        // Validaciones
        if (!nombreLimpio || nombreLimpio.length < 3) {
            console.error('❌ Error: Nombre debe tener al menos 3 caracteres');
            return { data: null, error: { message: 'Nombre debe tener al menos 3 caracteres.' } };
        }

        if (!telefonoLimpio || telefonoLimpio.length < 7 || telefonoLimpio.length > 10) {
            console.error('❌ Error: Teléfono debe tener entre 7 y 10 dígitos');
            return { data: null, error: { message: 'Teléfono debe tener entre 7 y 10 dígitos.' } };
        }

        if (!ciudadLimpia || ciudadLimpia.length < 2) {
            console.error('❌ Error: Ciudad debe tener al menos 2 caracteres');
            return { data: null, error: { message: 'Ciudad debe tener al menos 2 caracteres.' } };
        }

        // Initialize progress for all species
        const initialProgress = {};
        for (let i = 1; i <= 9; i++) {
            const speciesId = `0${i}`.slice(-2);
            initialProgress[`QR_${speciesId}_Completado`] = false;
        }

        console.log('🔄 Enviando a Supabase...', { 
            nombre_completo: nombreLimpio, 
            telefono: telefonoLimpio,
            ciudad: ciudadLimpia,
            progreso: initialProgress 
        });

        const { data, error } = await supabase
            .from('exploradores')
            .insert([
                { 
                    nombre_completo: nombreLimpio, 
                    telefono: telefonoLimpio,
                    ciudad: ciudadLimpia,
                    progreso: initialProgress
                },
            ])
            .select()
            .single(); // .single() returns the inserted row as an object, not an array

        if (error) {
            console.error('❌ Error de Supabase al guardar:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
        } else {
            console.log('✅ Usuario guardado exitosamente:', data);
        }

        return { data, error };
    }

    /**
     * Retrieves a user from Supabase by their phone number.
     * @param {string} telefono The user's phone number.
     * @returns {Promise<object|null>} The user data or null if not found.
     */
    async getUser(telefono) {
        const telefonoLimpio = sanitizePhone(telefono);
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
        const telefonoLimpio = sanitizePhone(telefono);
        const qrIdLimpio = sanitize(qrId);

        console.log('🔄 Actualizando progreso:', { telefono: telefonoLimpio, qrId: qrIdLimpio });

        if (!telefonoLimpio || !qrIdLimpio) return false;

        // 1. Get the user's current progress
        const user = await this.getUser(telefonoLimpio);
        if (!user) {
            console.error('❌ No se puede actualizar progreso: usuario no encontrado.');
            return false;
        }

        // 2. Update the progress object
        const newProgress = user.progreso || {};
        newProgress[qrIdLimpio] = true;

        console.log('📊 Nuevo progreso:', newProgress);

        // 3. Save the updated progress back to Supabase
        const { error } = await supabase
            .from('exploradores')
            .update({ progreso: newProgress })
            .eq('telefono', telefonoLimpio);

        if (error) {
            console.error('❌ Error actualizando progreso:', error);
            return false;
        }
        
        console.log('✅ Progreso actualizado exitosamente');
        return true;
    }
}
