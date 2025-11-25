// js/terms.js

/**
 * Módulo para gestionar la ventana modal de Términos y Condiciones.
 * Utiliza una Promise para pausar la ejecución de la app hasta que el usuario interactúe.
 */
export const TermsManager = {
    check: function() {
        return new Promise((resolve) => {
            // Validar localStorage
            let termsAccepted = false;
            try { termsAccepted = localStorage.getItem('termsAccepted') === 'true'; } catch (e) { /* ignore */ }

            if (termsAccepted) {
                console.log('✅ Términos ya aceptados previamente');
                resolve();
                return;
            }

            // Helper: crear modal si no existe
            const createModal = () => {
                const overlay = document.createElement('div');
                overlay.id = 'terms-modal-overlay';
                overlay.className = '';
                overlay.innerHTML = `
                    <div class="terms-modal-content">
                        <h2>Términos y Condiciones</h2>
                        <p>Para continuar y disfrutar de la experiencia de Realidad Aumentada, debes aceptar nuestros términos y condiciones.</p>
                        <div class="terms-buttons">
                            <button id="accept-terms-btn">Acepto</button>
                            <button id="decline-terms-btn">No Acepto</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
                return overlay;
            };

            // Intentar obtener elementos del DOM, crear modal si faltan
            let termsModal = document.getElementById('terms-modal-overlay');
            if (!termsModal) {
                console.warn('⚠️ Modal no encontrado en DOM, creando uno dinámicamente');
                termsModal = createModal();
            }

            // Buscar botones (puede que el modal haya sido creado dinámicamente)
            let acceptBtn = document.getElementById('accept-terms-btn');
            let declineBtn = document.getElementById('decline-terms-btn');

            if (!acceptBtn || !declineBtn) {
                // Si por alguna razón siguen faltando, intentar crear y reasignar
                console.warn('⚠️ Botones del modal no encontrados, recreando modal');
                termsModal.remove();
                termsModal = createModal();
                acceptBtn = document.getElementById('accept-terms-btn');
                declineBtn = document.getElementById('decline-terms-btn');
            }

            if (!termsModal || !acceptBtn || !declineBtn) {
                console.error('❌ No se pudieron obtener los elementos del modal de términos, continuando sin mostrar modal');
                try { localStorage.setItem('termsAccepted', 'true'); } catch (e) {}
                resolve();
                return;
            }

            // Forzar visibilidad con estilos inline para evitar reglas CSS que lo oculten
            try {
                if (termsModal.classList) termsModal.classList.remove('hidden');
            } catch (e) {}
            termsModal.style.display = 'flex';
            termsModal.style.position = 'fixed';
            termsModal.style.top = '0';
            termsModal.style.left = '0';
            termsModal.style.width = '100%';
            termsModal.style.height = '100%';
            termsModal.style.backgroundColor = 'rgba(0,0,0,0.7)';
            termsModal.style.zIndex = '99999';
            termsModal.style.justifyContent = 'center';
            termsModal.style.alignItems = 'center';

            // Log estilos computados para debugging
            try {
                const cs = window.getComputedStyle(termsModal);
                console.log('🔍 Computed styles for termsModal:', {
                    display: cs.display,
                    visibility: cs.visibility,
                    opacity: cs.opacity,
                    zIndex: cs.zIndex
                });
            } catch (e) {
                console.warn('⚠️ No se pudo leer estilos computados');
            }

            const cleanup = () => {
                acceptBtn.removeEventListener('click', onAccept);
                declineBtn.removeEventListener('click', onDecline);
            };

            const onAccept = () => {
                try { localStorage.setItem('termsAccepted', 'true'); } catch (e) {}
                if (termsModal.classList) termsModal.classList.add('hidden'); else termsModal.style.display = 'none';
                cleanup();
                console.log('✅ Términos aceptados por el usuario');
                resolve();
            };

            const onDecline = () => {
                console.log('❌ Términos rechazados por el usuario');
                alert('Debes aceptar los términos y condiciones para poder utilizar la aplicación. La pestaña se cerrará.');
                try { window.close(); } catch (e) {}
                document.body.innerHTML = '<h1 style="color:black; text-align:center; margin-top: 50px;">Por favor, cierra esta pestaña.</h1>';
            };

            acceptBtn.addEventListener('click', onAccept);
            declineBtn.addEventListener('click', onDecline);
        });
    }
};