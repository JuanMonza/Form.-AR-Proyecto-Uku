// js/router.js
import { Database } from './database.js';
import { SessionManager } from './tokenManager.js'; // Now SessionManager
import * as UI from './ui.js';
import { SPECIES_DATA } from './ui.js';

export class Router {
    constructor() {
        this.db = new Database();
        this.routes = {
            '/reto/iniciar': this.handleStart.bind(this),
            '/reto/paso': this.handleStep.bind(this),
            '/reto/finalizar': this.handleFinish.bind(this)
        };
    }

    navigate(path, params = {}) {
        console.log(`🔄 Navegando a: ${path}`, params);
        const handler = this.routes[path];
        if (handler) {
            console.log(`✅ Handler encontrado para ${path}`);
            handler(params);
        } else {
            console.error(`❌ No se encontró handler para ${path}`);
            UI.show404();
        }
    }

    handleStart() {
        // If a user session already exists, maybe take them to their current step?
        // For now, we just show the registration form as requested.
        console.log('📋 handleStart() - Mostrando formulario de registro');
        UI.showRegistrationForm();
    }

    async processRegistration(form) {
        console.log('🔄 processRegistration() iniciado');
        const formData = new FormData(form);
        const userData = {
            nombre: formData.get('nombre').trim(),
            telefono: formData.get('telefono').trim(),
            ciudad: formData.get('ciudad').trim()
        };

        console.log('📝 Datos del formulario:', userData);

        if (!userData.nombre || !userData.telefono || !userData.ciudad) {
            console.error('❌ Campos incompletos');
            UI.showError('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Attempt to save the user to Supabase
        console.log('💾 Guardando usuario en Supabase...');
        const { data: newUser, error } = await this.db.saveUser(userData);

        if (error) {
            // Log the full error to the console for debugging
            console.error('❌ Error details from Supabase:', error);

            // Handle specific errors, like a user already existing (unique constraint)
            if (error.code === '23505') { 
                // PostgreSQL unique violation code - user already exists
                console.log('⚠️ Usuario ya existe, recuperando datos...');
                const existingUser = await this.db.getUser(userData.telefono);
                
                if (existingUser) {
                    console.log('✅ Usuario existente encontrado, continuando sesión');
                    SessionManager.saveSession(existingUser.telefono);
                    this.navigate('/reto/paso', { id: '01' }); // Lo enviamos al primer paso
                    return;
                } else {
                    UI.showError('Este número de teléfono ya está registrado pero no se pudieron recuperar los datos.');
                    return;
                }
            } else {
                UI.showError(`Error en el registro: ${error.message}`);
                return;
            }
        }

        if (newUser) {
            // Registration successful, save session and go directly to first species
            console.log('✅ Nuevo usuario registrado exitosamente:', newUser);
            SessionManager.saveSession(newUser.telefono);
            this.navigate('/reto/paso', { id: '01' }); // Ir directo a la primera especie
        } else {
            console.error('❌ Error: newUser es null');
            UI.showError('Ocurrió un error inesperado durante el registro.');
        }
    }

    async handleStep(params) {
        const stepId = params.id;
        const telefono = SessionManager.getSession();

        if (!telefono) {
            UI.showBlockedMessage(); // Not registered or session cleared
            return;
        }

        const user = await this.db.getUser(telefono);
        if (!user) {
            UI.showBlockedMessage(); // User not found in DB
            return;
        }

        const species = SPECIES_DATA[stepId];
        if (!species) {
            UI.show404();
            return;
        }

        // Check if previous steps are completed
        const currentStep = parseInt(stepId, 10);
        if (currentStep > 1) {
            const prevStepId = `0${currentStep - 1}`.slice(-2);
            const prevQrId = `QR_${prevStepId}_Completado`;
            if (!user.progreso[prevQrId]) {
                UI.showProgressMessage(user.progreso); // Show missing steps
                return;
            }
        }

        // Update progress for the current step
        const qrId = `QR_${stepId}_Completado`;
        if (!user.progreso[qrId]) { // Avoid unnecessary updates
            await this.db.updateProgress(telefono, qrId);
        }

        UI.showSpeciesContent(stepId);
    }

    async handleFinish() {
        const telefono = SessionManager.getSession();
        if (!telefono) {
            UI.showBlockedMessage();
            return;
        }

        const user = await this.db.getUser(telefono);
        if (!user) {
            UI.showBlockedMessage();
            return;
        }

        // Check if all species have been discovered
        const allCompleted = Object.keys(SPECIES_DATA).every(stepId => {
            const qrId = `QR_${stepId}_Completado`;
            return user.progreso[qrId];
        });

        if (!allCompleted) {
            UI.showProgressMessage(user.progreso);
            return;
        }

        UI.showDodoAndCertificate(user);
    }
}
