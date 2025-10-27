// js/router.js
import { Database } from './database.js';
import { TokenManager } from './tokenManager.js';
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
        UI.showRegistrationForm();
    }

    processRegistration(form) {
        const formData = new FormData(form);
        const userData = {
            nombreCompleto: formData.get('nombre').trim(),
            numeroTelefono: formData.get('telefono').trim()
        };

        if (!userData.nombreCompleto || !userData.numeroTelefono) {
            UI.showError('Por favor completa todos los campos obligatorios.');
            return;
        }

        const token = TokenManager.generateToken();
        TokenManager.setToken(token);
        this.db.saveUser(token, userData);

        UI.showStartMessage(userData.nombreCompleto);
    }

    handleStep(params) {
        const stepId = params.id;
        const token = TokenManager.getToken();
        const user = this.db.getUser(token);

        if (!user) {
            UI.showBlockedMessage();
            return;
        }

        const species = SPECIES_DATA[stepId];
        if (!species) {
            UI.show404();
            return;
        }

        const currentStep = parseInt(stepId, 10);
        if (currentStep > 1) {
            const prevStepId = `0${currentStep - 1}`.slice(-2);
            const prevQrId = `QR_${prevStepId}_Completado`;
            if (!user[prevQrId]) {
                UI.showProgressMessage(user);
                return;
            }
        }

        const qrId = `QR_${stepId}_Completado`;
        this.db.updateProgress(token, qrId);

        UI.showSpeciesContent(stepId);
    }

    handleFinish() {
        const token = TokenManager.getToken();
        const user = this.db.getUser(token);

        if (!user) {
            UI.showBlockedMessage();
            return;
        }

        const allCompleted = Object.keys(SPECIES_DATA).every(stepId => {
            const qrId = `QR_${stepId}_Completado`;
            return user[qrId];
        });

        if (!allCompleted) {
            UI.showProgressMessage(user);
            return;
        }

        UI.showDodoAndCertificate(user);
    }
}