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
        const handler = this.routes[path];
        if (handler) {
            handler(params);
        } else {
            UI.show404();
        }
    }

    handleStart() {
        // If a user session already exists, maybe take them to their current step?
        // For now, we just show the registration form as requested.
        UI.showRegistrationForm();
    }

    async processRegistration(form) {
        const formData = new FormData(form);
        const userData = {
            nombre: formData.get('nombre').trim(),
            telefono: formData.get('telefono').trim()
        };

        if (!userData.nombre || !userData.telefono) {
            UI.showError('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Attempt to save the user to Supabase
        const { data: newUser, error } = await this.db.saveUser(userData);

        if (error) {
            // Log the full error to the console for debugging
            console.error('Error details from Supabase:', error);

            // Handle specific errors, like a user already existing (unique constraint)
            if (error.code === '23505') { // PostgreSQL unique violation code
                UI.showError('Este número de teléfono ya está registrado. Intenta continuar con tu reto.');
            } else {
                UI.showError(`Error en el registro: ${error.message}`);
            }
            return;
        }

        if (newUser) {
            // Registration successful, save session and show start message
            SessionManager.saveSession(newUser.telefono);
            UI.showStartMessage(newUser.nombre_completo);
        } else {
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
