// js/main.js
import { Router } from './router.js';
import { TokenManager } from './tokenManager.js';
import { Database } from './database.js';
import * as UI from './ui.js';

function downloadCertificate() {
    const token = TokenManager.getToken();
    const db = new Database();
    const user = db.getUser(token);

    if (!user) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(45, 80, 22); // --primary-dark-green
    doc.text('Certificado de Explorador Extinción', 105, 40, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(74, 124, 89); // --primary-green
    doc.text('Bioparque Ukumarí', 105, 55, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    const mainText = `Se otorga a ${user.nombreCompleto} por completar con éxito el Reto de Explorador Extinción del Bioparque Ukumarí.`;
    const splitText = doc.splitTextToSize(mainText, 160);
    doc.text(splitText, 105, 100, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Especies Extintas Descubiertas:', 105, 140, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.text('Mamut Lanudo (Mammuthus primigenius)', 105, 155, { align: 'center' });
    doc.text('Tigre de Tasmania (Thylacinus cynocephalus)', 105, 165, { align: 'center' });
    doc.text('Dodo (Raphus cucullatus)', 105, 175, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 105, 200, { align: 'center' });

    doc.save(`Certificado_Explorador_Extincion_${user.nombreCompleto.replace(/\s+/g, '_')}.pdf`);
}

function initializeApp() {
    const router = new Router();

    // Delegación de eventos centralizada para manejar todos los clics de la aplicación
    document.body.addEventListener('click', e => {
        // Botones del simulador de QR
        const testButton = e.target.closest('#test-buttons .btn');
        if (testButton) {
            const path = testButton.dataset.path;
            const params = testButton.dataset.params ? JSON.parse(testButton.dataset.params) : {};
            router.navigate(path, params);
            return;
        }

        // Botón de descarga de certificado
        if (e.target.matches('#download-cert-btn')) {
            downloadCertificate();
            return;
        }

        // Botones de navegación (ej: volver al inicio desde la página de error o bloqueo)
        if (e.target.matches('#go-to-register-btn') || e.target.matches('#go-to-home-btn')) {
            router.navigate('/reto/iniciar');
            return;
        }
    });

    // Delegación para el envío del formulario de registro
    document.body.addEventListener('submit', e => {
        if (e.target.matches('#registration-form')) {
            e.preventDefault();
            router.processRegistration(e.target);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const qrType = urlParams.get('qr');
    const stepId = urlParams.get('id');

    if (qrType === 'inicio') router.navigate('/reto/iniciar');
    else if (qrType === 'paso' && stepId) router.navigate('/reto/paso', { id: stepId });
    else if (qrType === 'final') router.navigate('/reto/finalizar');
    else UI.showTestMenu(); // Menú de simulación por defecto
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);