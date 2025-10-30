// js/ui.js

const appContent = document.getElementById('app-content');
const loader = document.getElementById('loader');

// --- DATA ---
export const SPECIES_DATA = {
    '01': { name: 'Mamut Lanudo', model: 'mamut+modelo+3d.glb', facts: ['Vivieron durante la Era de Hielo.', 'Podían medir hasta 4 metros de altura.', 'Su pelaje los protegía de temperaturas de -40°C.'] },
    '02': { name: 'Tigre de Tasmania', model: 'tigre+tasmania+3d+model.glb', facts: ['Era el marsupial carnívoro más grande.', 'Podía abrir su mandíbula hasta 120 grados.', 'El último ejemplar murió en un zoológico en 1936.'] },
    '03': { name: 'Rinoceronte Del Negro', model: 'rhinoceros+3d+model.glb', facts: ['Especie antigua de la familia del rinoceronte.', 'Adaptado a climas fríos.', 'Pariente de los rinocerontes de Java y Sumatra.'] },
    '04': { name: 'Vaca Marina de Steller', model: 'manatee+3d+model.glb', facts: ['Mamífero marino herbívoro.', 'También conocido como "vaca marina".', 'Su pariente más cercano es el elefante.'] },
    '05': { name: 'Pato', model: 'mallard+duck+3d+model.glb', facts: ['Ancestro de la mayoría de los patos domésticos.', 'Se encuentra en todo el hemisferio norte.', 'Los machos tienen una cabeza verde brillante distintiva.'] },
    '06': { name: 'Foca', model: 'seal+3d+model.glb', facts: ['Mamífero marino carnívoro.', 'Excelentes nadadores.', 'Pueden dormir bajo el agua.'] },
    '07': { name: 'Rana Dorada', model: 'orange+frog+3d+model.glb', facts: ['Anfibio de colores brillantes.', 'Su piel a menudo indica que es venenosa.', 'Ponen sus huevos en el agua.'] },
    '08': { name: 'Pájaro', model: 'small+bird+3d+model.glb', facts: ['Ave pequeña y ágil.', 'Existen miles de especies en todo el mundo.', 'Algunos pueden imitar sonidos.'] },
    '09': { name: 'Dodo', model: '3d+model+Dodo+Bird.glb', facts: ['Vivía únicamente en la isla de Mauricio.', 'No podía volar.', 'Se extinguió por la caza y especies invasoras.'] }
};

const TOTAL_SPECIES = Object.keys(SPECIES_DATA).length;

// --- HELPERS ---

function render(htmlContent) {
    loader.classList.remove('hidden');
    setTimeout(() => {
        appContent.innerHTML = htmlContent;
        loader.classList.add('hidden');
    }, 300);
}

function createProgressBar(current, total) {
    const percent = (current / total) * 100;
    return `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>
        <p class="text-center mt-10 font-bold">Progreso: ${current} / ${total} completado</p>
    `;
}

function createModelViewer(species) {
    return `
        <div class="ar-container">
            <model-viewer
                src="models/${species.model}"
                alt="Modelo 3D de ${species.name}"
                auto-rotate camera-controls ar ar-modes="webxr scene-viewer quick-look"
                environment-image="neutral"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='16' fill='%23666'%3E${species.name} 3D%3C/text%3E%3C/svg%3E"
                shadow-intensity="1"
                style="background: transparent;">
                <button class="btn ar-button" slot="ar-button">Ver en AR</button>
            </model-viewer>
        </div>
        <div class="info-box-ar-tip" id="ar-tip-box"></div>
    `;
}

// --- UI COMPONENTS ---
// Detectar sistema operativo
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}
function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function showSpeciesContent(speciesId) {
    const species = SPECIES_DATA[speciesId];
    if (!species) {
        show404();
        return;
    }

    const currentStep = parseInt(speciesId, 10);
    const nextStep = currentStep + 1;
    const nextSpecies = SPECIES_DATA[`0${nextStep}`.slice(-2)];

    let nextMissionHTML = `
        <div class="info-box info-box-next-mission-alt">
            <h3 class="info-box-title">¡Misión Final!</h3>
            <p class="text-dark">
                Busca el <strong>QR del Certificado</strong> para completar tu reto.
            </p>
        </div>
        <button class="btn" data-path="/reto/finalizar">Ir por el Certificado</button>
    `;

    if (nextSpecies) {
        nextMissionHTML = `
            <div class="info-box info-box-next-mission-alt">
                <h3 class="info-box-title">Siguiente Objetivo:</h3>
                <p class="text-dark">
                    Busca el <strong>QR de ${nextSpecies.name}</strong>.
                </p>
            </div>
            <button class="btn" data-path="/reto/paso" data-params='{"id": "${('0' + nextStep).slice(-2)}"}'>Continuar Búsqueda</button>
        `;
    }

    // Generar el nombre de la imagen según la especie
        let imageName = species.name.toLowerCase().replace(/ /g, '').replace(/[áéíóúñ]/g, function(match) {
            const map = { 'á':'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u', 'ñ':'n' };
            return map[match];
        });
        if (speciesId === '01') imageName = 'Lanudo';
        if (speciesId === '02') imageName = 'tigre';
        if (speciesId === '03') imageName = 'rinoceronte';
        if (speciesId === '04') imageName = 'vaca';
        if (speciesId === '05') imageName = 'Pato';
        if (speciesId === '06') imageName = 'FOCA';
        if (speciesId === '07') imageName = 'Rana';
        if (speciesId === '08') imageName = 'Anteojito';
        if (speciesId === '09') imageName = 'Dodo';

    const content = `
        <div class="content-card">
            <div class="species-card">
                <img src="models/${imageName}.png" alt="${species.name}" class="species-title" style="display:block;margin:0 auto 20px auto;max-width:300px;width:100%;">
                ${createModelViewer(species)}
                <div class="info-box">
                    <h3 class="info-box-title">📚 Datos:</h3>
                    <ul class="info-list">
                        ${species.facts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
                <div class="success-message">
                    ¡Especie descubierta! ${species.name} completado
                </div>
                ${createProgressBar(currentStep + 1, TOTAL_SPECIES + 1)}
                ${nextMissionHTML}
                <button id="ar-screenshot-button" class="btn">Tomar Foto</button>
            </div>
        </div>
    `;
    render(content);
    // Personalizar el mensaje AR según el sistema operativo
    setTimeout(() => {
        const arTipBox = document.getElementById('ar-tip-box');
        if (arTipBox) {
            arTipBox.innerHTML = isAndroid()
                ? '💡 <strong>Pro Tip:</strong> En Android, usa el botón de captura de pantalla de tu dispositivo mientras ves el animal en AR. El botón "Tomar Foto" puede no estar disponible.'
                : '💡 <strong>Pro Tip:</strong> En iOS, puedes usar el botón de la app para tomar la foto en AR.';
            // Ocultar el botón en Android si no funciona
            if (isAndroid()) {
                const btnFoto = document.getElementById('ar-screenshot-button');
                if (btnFoto) btnFoto.style.display = 'none';
            }
        }
    }, 350);
}

export function showRegistrationForm() {
    const content = `
        <div class="content-card">
            <img src="models/Bienvenido_Explorador.png" alt="Bienvenido Explorador" style="display:block;margin:0 auto 20px auto;max-width:350px;width:100%;">
            <p class="text-center mb-30 fs-1-1">
                Estás a punto de embarcarte en una misión única para descubrir ${TOTAL_SPECIES} especies. 
                Completa tu registro para comenzar esta aventura.
            </p>
            
            <form id="registration-form">
                <div class="form-group">
                    <label for="nombre">Nombre Completo</label>
                    <input type="text" id="nombre" name="nombre" required 
                           placeholder="Ingresa tu nombre completo">
                </div>
                
                <div class="form-group">
                    <label for="telefono">Número de Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" required 
                           placeholder="Ingresa tu número de teléfono">
                </div>
                
                <button type="submit" class="btn">
                    Iniciar Misión de Explorador
                </button>
            </form>
        </div>
    `;
    render(content);
}

export function showStartMessage(nombre) {
    const firstSpecies = SPECIES_DATA['01'];
    const content = `
        <div class="content-card">
            <div class="text-center">
                <h2 class="text-primary-dark mb-20">🎉 ¡Explorador ${nombre}! 🎉</h2>
                <div class="success-message">
                    ¡El reto ha comenzado oficialmente!
                </div>
                <p class="fs-1-2 my-25 lh-1-6">
                    Tu misión: <strong>Encuentra los ${TOTAL_SPECIES} QR de especies</strong> 
                    distribuidos por el Bioparque para ganar tu certificado.
                </p>
                
                ${createProgressBar(1, TOTAL_SPECIES + 1)}
                
                <div class="info-box info-box-next-mission">
                    <h3 class="info-box-title text-blue">🔍 Tu próxima misión:</h3>
                    <p class="text-dark">
                        Busca el <strong>QR de ${firstSpecies.name}</strong>. 
                        ¡Será tu primera especie por descubrir!
                    </p>
                </div>
                
                <button class="btn" data-path="/reto/paso" data-params='{"id": "01"}'>
                    🗺 Continuar Explorando
                </button>
            </div>
        </div>
    `;
    render(content);
}

export function showDodoAndCertificate(user) {
    const content = `
        <div class="content-card">
            <img src="models/Ganaste_2025.png" alt="¡Ganaste!" class="success-image" style="display:block;margin:0 auto 20px auto;max-width:450px;width:100%;">
            
            ${createProgressBar(TOTAL_SPECIES + 1, TOTAL_SPECIES + 1)}
            
            <div class="certificate">
                <div class="certificate-content">
                    <img src="models/Certificado_Explorador.png" alt="Certificado Explorador" class="certificate-title" style="display:block;margin:0 auto 20px auto;max-width:350px;width:100%;">
                    <p class="certificate-text">
                        Se otorga a <strong>${user.nombreCompleto}</strong> 
                        por completar con éxito el Reto de Explorador Extinción 
                        del Bioparque Ukumarí.
                    </p>
                    <p class="certificate-subtext">
                        Has demostrado tu compromiso con la conservación y el conocimiento 
                        de las especies que ya no están con nosotros.
                    </p>
                    <p class="font-bold text-primary-dark">Bioparque Ukumarí - ${new Date().toLocaleDateString('es-CO')}</p>
                </div>
            </div>
            
            <div class="share-buttons">
                <button id="download-cert-btn" class="btn download-btn">
                    Descargar Certificado
                </button>
                <a href="https://wa.me/?text=¡Completé el Reto de Explorador Extinción en el Bioparque Ukumarí! Descubrí ${TOTAL_SPECIES} especies y gané mi certificado. ¡Una experiencia increíble!" 
                   target="_blank" class="share-btn">
                    Compartir en WhatsApp
                </a>
            </div>
        </div>
    `;
    render(content);
}

export function showBlockedMessage() {
    const content = `
        <div class="content-card">
            <div class="blocked-message">
                <div class="fs-3 mb-20">🚫</div>
                <h2 class="text-pink mb-20">¡Alto!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 25px;">
                    Regresa al QR principal y activa tu misión de Explorador de Extinción.
                </p>
                <p class="text-light-gray">Necesitas registrarte primero para comenzar esta aventura de descubrimiento.</p>
                <button id="go-to-register-btn" class="btn mt-20">
                    Ir al Registro
                </button>
            </div>
        </div>
    `;
    render(content);
}

export function showProgressMessage(progress) {
    const discovered = Object.keys(SPECIES_DATA).filter(id => progress[`QR_${id}_Completado`]);
    const missing = Object.keys(SPECIES_DATA).filter(id => !progress[`QR_${id}_Completado`]);

    const content = `
        <div class="content-card">
            <div class="progress-message">
                <div class="fs-3 mb-20">⏳</div>
                <h2 class="text-dark-blue mb-20">¡Aún no has ganado el reto!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 25px;">
                    Te falta descubrir algunas especies perdidas. 
                    ¡Busca los pasos que faltan!
                </p>
                
                <div class="info-box bg-white">
                    <h3 class="text-pink mb-15">Especies por descubrir:</h3>
                    <ul class="info-list no-bullets">
                        ${missing.map(id => `<li>${SPECIES_DATA[id].name}</li>`).join('')}
                    </ul>
                </div>
                
                ${createProgressBar(discovered.length + 1, TOTAL_SPECIES + 1)}
                
                <button class="btn mt-20" data-path="/reto/paso" data-params='{"id": "${missing[0]}"}'>
                    🔍 Continuar Búsqueda
                </button>
            </div>
        </div>
    `;
    render(content);
}

export function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('registration-form');
    if (form) {
        form.parentNode.insertBefore(errorDiv, form);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

export function show404() {
    const content = `
        <div class="content-card">
            <div class="text-center">
                <div class="fs-4 mb-20">🔍</div>
                <h2 class="text-pink">Página no encontrada</h2>
                <p>La página que buscas no existe o ha sido movida.</p>
                <button id="go-to-home-btn" class="btn">
                    Volver al Inicio
                </button>
            </div>
        </div>
    `;
    render(content);
}

let qrPrincipalEscaneado = false;

export function setQRPrincipalEscaneado(valor) {
    qrPrincipalEscaneado = valor;
}

export function showTestMenu() {
    const content = `
        <div class="content-card">
            <img src="models/Escanea.png" alt="Escanea" style="display:block;margin:0 auto 30px auto;max-width:400px;width:100%;">
            <p class="text-center mb-30">
                Escanea nuestro Qr y vive una experiencia de Realidad Aumentada:
            </p>
            <div id="test-buttons" class="grid-buttons">
                <button class="btn" id="btn-iniciar-reto">
                Inicia Tú Reto Ahora
                </button>
            </div>
        </div>
    `;
    render(content);
    setTimeout(() => {
        const btnIniciar = document.getElementById('btn-iniciar-reto');
        if (btnIniciar) {
            btnIniciar.onclick = () => {
                mostrarFormularioRegistro();
            };
        }
    }, 350);
}

function mostrarFormularioRegistro() {
    const content = `
        <div class="content-card">
            <img src="models/Bienvenido_Explorador.png" alt="Bienvenido Explorador" style="display:block;margin:0 auto 20px auto;max-width:350px;width:100%;">
            <p class="text-center mb-30 fs-1-1">
                Estás a punto de embarcarte en una misión única para descubrir ${TOTAL_SPECIES} especies. 
                Completa tu registro para comenzar esta aventura.
            </p>
            <form id="registration-form">
                <div class="form-group">
                    <label for="nombre">Nombre Completo</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Ingresa tu nombre completo">
                </div>
                <div class="form-group">
                    <label for="telefono">Número de Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" required placeholder="Ingresa tu número de teléfono">
                </div>
                <button type="submit" class="btn">Iniciar Misión de Explorador</button>
            </form>
        </div>
    `;
    render(content);
    setTimeout(() => {
        const form = document.getElementById('registration-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const nombre = form.nombre.value.trim();
                const telefono = form.telefono.value.trim();
                if (!nombre || !telefono) {
                    showError('Por favor completa todos los campos para iniciar la aventura.');
                    return;
                }
                mostrarEspeciesMenu();
            };
        }
    }, 350);
}

function mostrarEspeciesMenu() {
    const especiesBtns = Object.keys(SPECIES_DATA).map(id => {
        return `<button class="btn" data-path="/reto/paso" data-params='{"id": "${id}"}'>${SPECIES_DATA[id].name}</button>`;
    }).join('');
    const content = `
        <div class="content-card">
            <h2 class="text-primary-dark text-center mb-20">Selecciona una especie para explorar</h2>
            <div id="test-buttons" class="grid-buttons">
                ${especiesBtns}
                <button class="btn" data-path="/reto/finalizar">Certificado Final</button>
            </div>
        </div>
    `;
    render(content);
}
