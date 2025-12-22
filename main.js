// js/main.js
import { Router } from './router.js';
import { SessionManager } from './tokenManager.js'; // Now SessionManager
import { Database } from './database.js';
import * as UI from './ui.js';

/**
 * Genera y descarga un certificado en PDF usando una plantilla existente.
 * Carga un PDF, estampa el nombre del usuario y lo guarda.
 */
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

    // Verificación profesional: Asegurarse de que la librería PDF esté cargada
    if (typeof window.PDFLib === 'undefined') {
        console.error('❌ PDFLib no está cargado. No se puede generar el certificado.');
        alert('La función para generar certificados no está lista. Por favor, recarga la página e inténtalo de nuevo.');
        // Opcional: Deshabilitar el botón para evitar más clics
        document.getElementById('download-cert-btn')?.setAttribute('disabled', 'true');
        return;
    }

    try {
        // --- PASO 1: Cargar la plantilla PDF ---
        const urlPlantilla = 'models/Expedition_Certicate_explorer_ Completion_Certificate_A4.pdf';
        const existingPdfBytes = await fetch(urlPlantilla).then(res => res.arrayBuffer());

        // --- PASO 2: Cargar el documento con pdf-lib ---
        const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Cargar una fuente estándar (puedes cargar fuentes .ttf también)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // --- PASO 3: "Estampar" el nombre en la primera página ---
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize(); // Obtiene el tamaño de la página (A4 es aprox. 595x842 puntos)

        const nombre = user.nombre_completo;
        const fontSize = 30; // Tamaño de fuente (ajústalo si es necesario)

        // --- AJUSTE DE COORDENADAS (X, Y) ---
        // El origen (0,0) es la esquina INFERIOR IZQUIERDA.
        // Deberás ajustar 'x' e 'y' para centrar el nombre en la línea de tu PDF.
        const textWidth = helveticaFont.widthOfTextAtSize(nombre, fontSize);
        const x = (width - textWidth) / 2; // Centrado horizontal
        const y = height / 2 + 30;         // Aproximadamente en el centro vertical (¡AJUSTAR!)

        firstPage.drawText(nombre, {
            x: x,
            y: y,
            font: helveticaFont,
            size: fontSize,
            color: rgb(0.1, 0.1, 0.1), // Color casi negro
        });

        // --- PASO 4: Guardar el PDF y preparar la descarga ---
        const pdfBytes = await pdfDoc.save();

        // Crear un Blob y una URL para descargar el archivo
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Certificado_${user.nombre_completo.replace(/\s+/g, '_')}.pdf`;
        link.click();

    } catch (error) {
        console.error('❌ Error al generar el certificado PDF:', error);
        alert('Hubo un problema al generar tu certificado. Por favor, inténtalo de nuevo.');
    }
}

// Variable para asegurar que la inicialización principal solo ocurra una vez.
let isAppInitialized = false;

/**
 * Inicializa el router y los manejadores de eventos principales de la aplicación.
 * Esta función se llama DESPUÉS de que el usuario interactúa por primera vez.
 */
function initializeApp() {
    if (isAppInitialized) return; // Prevenir doble inicialización
    isAppInitialized = true;

    const router = new Router();

    // Delegación de eventos para el envío del formulario
    document.body.addEventListener('submit', async e => {
        if (e.target.matches('#registration-form')) {
            console.log('✅ Formulario de registro enviado');
            e.preventDefault();
            await router.processRegistration(e.target);
        }
    });

    // Delegación de eventos para todos los clics
    document.body.addEventListener('click', async e => {
        const target = e.target;

        // Botones de navegación con data-path
        const navButton = target.closest('.btn[data-path]');
        if (navButton) {
            const path = navButton.dataset.path;
            const params = navButton.dataset.params ? JSON.parse(navButton.dataset.params) : {};
            router.navigate(path, params);
            return;
        }

        // Botón de descarga de certificado
        if (target.matches('#download-cert-btn')) {
            await downloadCertificate();
            return;
        }

        // Botón de compartir en WhatsApp
        if (target.matches('#share-whatsapp-btn')) {
            // Primero descargar el certificado
            await downloadCertificate();
            // Mostrar instrucción al usuario
            alert('✅ Certificado descargado. Ahora adjúntalo en WhatsApp.');
            // Esperar un momento y luego abrir WhatsApp
            setTimeout(() => {
                const message = '¡Completé el Reto de Explorador Extinción en el Bioparque Ukumarí! 🎉\n\nDescubrí 10 especies extintas y gané mi certificado. 📜\n\n¡Una experiencia increíble de Realidad Aumentada en el Bioparque! 🦣🐯🦏';
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            }, 500);
            return;
        }

        // Botones para volver al inicio/registro
        if (target.matches('#go-to-register-btn') || target.matches('#go-to-home-btn')) {
            router.navigate('/reto/iniciar');
            return;
        }
    });

    // Manejo de la URL inicial para navegación directa
    const urlParams = new URLSearchParams(window.location.search);
    const qrType = urlParams.get('qr');
    const stepId = urlParams.get('id');

    if (qrType === 'inicio') {
        router.navigate('/reto/iniciar');
    } else if (qrType === 'paso' && stepId) {
        router.navigate('/reto/paso', { id: stepId });
    } else if (qrType === 'final') {
        router.navigate('/reto/finalizar');
    } else {
        // Si no hay parámetros QR, mostramos el formulario de registro directamente.
        router.navigate('/reto/iniciar');
    }
}

// Iniciar la aplicación cuando el DOM esté listo.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostramos la pantalla de bienvenida/inicio.
    UI.showTestMenu();

    // 2. Escuchamos clics en todo el documento
    setTimeout(() => {
        document.addEventListener('click', function handleClick(e) {
            // Buscar el botón en el elemento clickeado o sus padres
            const button = e.target.closest('#btn-iniciar-reto');
            
            if (button) {
                // Remover el listener
                document.removeEventListener('click', handleClick);
                
                // Inicializar la app
                initializeApp();
            }
        }, { once: false });
    }, 500);
});
