// js/main.js
import { Router } from './router.js';
import { SessionManager } from './tokenManager.js'; // Now SessionManager
import { Database } from './database.js';
import * as UI from './ui.js';

async function downloadCertificate() {
    const telefono = SessionManager.getSession();
    if (!telefono) {
        alert('No se encontró una sesión de usuario. Por favor, regístrate de nuevo.');
        return;
    }

    const db = new Database();
    const user = await db.getUser(telefono);

    if (!user) {
        alert('No se pudieron obtener los datos del usuario para el certificado.');
        return;
    }

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
    const mainText = `Se otorga a ${user.nombre_completo} por completar con éxito el Reto de Explorador Extinción del Bioparque Ukumarí.`;
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

    doc.save(`Certificado_Explorador_Extincion_${user.nombre_completo.replace(/\s+/g, '_')}.pdf`);
}

function initializeApp() {
    const router = new Router();

    // Delegación de eventos centralizada para manejar todos los clics de la aplicación
    document.body.addEventListener('click', async e => {
        const navButton = e.target.closest('.btn[data-path]');
        if (navButton) {
            const path = navButton.dataset.path;
            const params = navButton.dataset.params ? JSON.parse(navButton.dataset.params) : {};
            router.navigate(path, params);
            return;
        }

        if (e.target.matches('#download-cert-btn')) {
            await downloadCertificate();
            return;
        }

        if (e.target.matches('#go-to-register-btn') || e.target.matches('#go-to-home-btn')) {
            router.navigate('/reto/iniciar');
            return;
        }

        if (e.target.matches('#ar-screenshot-button')) {
            const modelViewer = document.querySelector('model-viewer');
            if (modelViewer && modelViewer.arActive) {
                try {
                    const dataUrl = await modelViewer.screenshot();
                    const img = document.createElement('img');
                    img.src = dataUrl;
                    img.style.width = '200px';
                    img.style.position = 'fixed';
                    img.style.top = '10px';
                    img.style.left = '10px';
                    img.style.zIndex = '9999';
                    document.body.appendChild(img);
                    
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = 'captura-ar.png';
                    a.click();

                    setTimeout(() => img.remove(), 5000);
                } catch (error) {
                    console.error('Error taking screenshot:', error);
                    alert('Error al tomar la captura de pantalla.');
                }
            } else if (modelViewer) {
                alert('Debes estar en modo AR para tomar una foto.');
            }
            return;
        }
    });

    // Delegación para el envío del formulario de registro
    document.body.addEventListener('submit', async e => {
        if (e.target.matches('#registration-form')) {
            e.preventDefault();
            await router.processRegistration(e.target);
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
