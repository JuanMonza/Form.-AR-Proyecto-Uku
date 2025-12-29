// js/ui.js

const appContent = document.getElementById('app-content');
const loader = document.getElementById('loader');

// --- DATA ---
export const SPECIES_DATA = {
    '01': { name: 'Mamut Lanudo', model: 'mamut+modelo+3d.glb', facts: ['Vivieron durante la Era de Hielo.', 'Podían medir hasta 4 metros de altura.', 'Su pelaje los protegía de temperaturas de -40°C.'] },
    '02': { name: 'Tigre de Tasmania', model: 'tigre+tasmania+3d+model.glb', facts: ['Era el marsupial carnívoro más grande.', 'Podía abrir su mandíbula hasta 120 grados.', 'El último ejemplar murió en un zoológico en 1936.'] },
    '03': { name: 'Rinoceronte Del Negro', model: 'rhinoceros+3d+model.glb', facts: ['Habitaba la sabana del centro-oeste de África.', 'Media hasta 3.8m de largo.', 'Su extinción se le atribuye a la caza.'] },
    '04': { name: 'Vaca Marina de Steller', model: 'manatee+3d+model.glb', facts: ['Median hasta 8 metros de longitud.', 'También conocido como "vaca marina".', 'Pesaban entre 4 y 10 toneladas.', 'Fue cazada hasta su extinción por los marineros'] },
    '05': { name: 'Pato', model: 'mallard+duck+3d+model.glb', facts: ['Habitó las montañas andinas de Colombia.', 'Vivía en lagunas y pantanos.', 'Su extinción se atribuye a la contaminación de las lagunas.', 'No podia Volar', 'Media 1 metro de altura.'] },
    '06': { name: 'Foca', model: 'seal+3d+model.glb', facts: ['Median entre 2.20m - 2.40m de largo.', 'Sus únicos depredadores eran los tiburones.', 'Era cazada por su piel y grasa.'] },
    '07': { name: 'Rana Dorada', model: 'orange+frog+3d+model.glb', facts: ['Habitó en el bosque de Monteverde,  Costa Rica.', 'Su piel era lustrosa y brillante.', 'Se cree que vivían bajo tierra.'] },
    '08': { name: 'Pájaro', model: 'small+bird+3d+model.glb', facts: ['Ave pequeña y ágil.', 'Existen miles de especies en todo el mundo.', 'Algunos pueden imitar sonidos.'] },
    '09': { name: 'Dodo', model: '3d+model+Dodo+Bird.glb', facts: ['Era endémico de las Islas Marinas de Mauricio .', 'No podía volar.', 'Habitó en bosques y matorrales.', 'Su extinción se le atribuye a la introducción de la serpiente Boiga irregularis'] },
    '10': { name:'Delfin', model: 'dolphin+3d+model.glb', facts: ['Declarado extinto en 2006 tras una expedición sin resultados.', 'La represa de las Tres Gargantas contribuyó a la pérdida de su hábitat.', 'Endémico del río Yangtsé, China.','Su extinción se atribuye principalmente a la acción humana.'] }
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
        <model-viewer
            src="models/${species.model}"
            alt="Modelo 3D de ${species.name}"
            auto-rotate 
            camera-controls 
            ar 
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            style="width: 100%; height: 400px;">
            <button class="btn ar-button" slot="ar-button">Ver en AR</button>
        </model-viewer>
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
                    Busca la <strong>siguiente especie</strong> y consigue tu certificado.
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
        if (speciesId === '10') imageName = 'Delfin_chino_de_rio';

    const content = `
        <div class="content-card">
            <div class="species-card">
                <img src="models/${imageName}.webp" alt="${species.name}" class="species-title" style="display:block;margin:0 auto 20px auto;max-width:300px;width:100%;">
                ${createModelViewer(species)}
                <div class="info-box">
                    <h3 class="info-box-title">Datos:</h3>
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
            if (isAndroid()) {
                arTipBox.innerHTML = '💡 <strong>Android:</strong> Si te pide instalar algo, acepta instalar "Google Play Services for AR" (es gratis). Luego toca "Ver en AR" nuevamente para ver el animal en tu espacio real. ¡Toma fotos con el botón de cámara de tu teléfono!';
                // Ocultar el botón de foto en Android
                const btnFoto = document.getElementById('ar-screenshot-button');
                if (btnFoto) btnFoto.style.display = 'none';
            } else {
                arTipBox.innerHTML = '💡 <strong>iOS:</strong> Toca "Ver en AR" para ver el animal en tu espacio. ¡La cámara se abrirá automáticamente! Usa el botón blanco para tomar fotos.';
            }
        }
    }, 350);
}

export function showRegistrationForm() {
    console.log('📝 showRegistrationForm() - Renderizando formulario');
    const content = `
        <div class="content-card">
            <img src="models/Bienvenido_Explorador.webp" alt="Bienvenido Explorador" style="display:block;margin:0 auto 20px auto;max-width:350px;width:100%;">
            <p class="text-center mb-30 fs-1-1">
                Estás a punto de embarcarte en una misión única para descubrir ${TOTAL_SPECIES} especies. 
                Completa tu registro para comenzar esta aventura.
            </p>
            
            <form id="registration-form">
                <div class="form-group">
                    <label for="nombre">Nombre Completo</label>
                    <input type="text" id="nombre" name="nombre" required 
                           placeholder="Ingresa tu nombre completo"
                           minlength="3"
                           maxlength="100"
                           autocomplete="name"
                           title="Ingresa tu nombre completo">
                </div>
                
                <div class="form-group">
                    <label for="telefono">Número de Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" required 
                           placeholder="Ej: 3001234567"
                           minlength="7"
                           maxlength="10"
                           autocomplete="tel"
                           inputmode="numeric"
                           title="Solo se permiten números (7-10 dígitos)">
                </div>
                
                <div class="form-group">
                    <label for="ciudad">Ciudad</label>
                    <input type="text" id="ciudad" name="ciudad" required 
                           placeholder="Ingresa tu ciudad"
                           minlength="2"
                           maxlength="50"
                           autocomplete="address-level2"
                           title="Ingresa tu ciudad">
                </div>

                <div class="form-group-checkbox">
                    <input type="checkbox" id="age-check" name="age-check">
                    <label for="age-check">Soy mayor de 18 años</label>
                </div>

                <div class="form-group-checkbox">
                    <input type="checkbox" id="data-treatment" name="data-treatment">
                    <label for="data-treatment">Acepto tratamiento de datos</label>
                </div>
                
                <button type="submit" id="submit-registration" class="btn" disabled>
                    Iniciar Misión de Explorador
                </button>
            </form>
        </div>
    `;
    render(content);
    
    // Agregar validación en tiempo real después de renderizar
    setTimeout(() => {
        console.log('🔍 Configurando validación del formulario');
        const ageCheck = document.getElementById('age-check');
        const dataTreatment = document.getElementById('data-treatment');
        const submitBtn = document.getElementById('submit-registration');
        const nombreInput = document.getElementById('nombre');
        const telefonoInput = document.getElementById('telefono');
        const ciudadInput = document.getElementById('ciudad');

        if (!ageCheck || !dataTreatment || !submitBtn || !nombreInput || !telefonoInput || !ciudadInput) {
            console.error('❌ Error: No se encontraron todos los elementos del formulario');
            return;
        }

        // Asegurar que los checkboxes inician unchecked
        ageCheck.checked = false;
        dataTreatment.checked = false;
        submitBtn.disabled = true;

        // Función para validar si el formulario está completo
        const validateForm = () => {
            const allFieldsFilled = nombreInput.value.trim().length >= 3 && 
                                   telefonoInput.value.trim().length >= 7 && 
                                   ciudadInput.value.trim().length >= 2;
            const ageChecked = ageCheck.checked;
            const dataChecked = dataTreatment.checked;
            const isEnabled = allFieldsFilled && ageChecked && dataChecked;
            submitBtn.disabled = !isEnabled;
            console.log(`📋 Validación: nombre=${nombreInput.value.trim().length >= 3}, tel=${telefonoInput.value.trim().length >= 7}, ciudad=${ciudadInput.value.trim().length >= 2}, age=${ageChecked}, data=${dataChecked}, habilitado=${isEnabled}`);
        };

        if (ageCheck) {
            ageCheck.addEventListener('change', () => {
                console.log('✅ Checkbox de edad cambió a:', ageCheck.checked);
                validateForm();
            });
        }

        if (dataTreatment) {
            dataTreatment.addEventListener('change', () => {
                console.log('✅ Checkbox de tratamiento de datos cambió a:', dataTreatment.checked);
                validateForm();
            });
        }
        
        if (nombreInput) {
            nombreInput.addEventListener('input', (e) => {
                // Solo permitir letras y espacios, remover caracteres especiales
                e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                validateForm();
            });
        }
        
        if (telefonoInput) {
            telefonoInput.addEventListener('input', (e) => {
                // Solo permitir números
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                validateForm();
            });
        }
        
        if (ciudadInput) {
            ciudadInput.addEventListener('input', (e) => {
                // Solo permitir letras, espacios y guiones
                e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]/g, '');
                validateForm();
            });
        }

        console.log('✅ Validadores configurados correctamente');
    }, 350);
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
            <img src="models/Ganaste_2025.webp" alt="¡Ganaste!" class="success-image" style="display:block;margin:0 auto 20px auto;max-width:450px;width:100%;">
            
            ${createProgressBar(TOTAL_SPECIES + 1, TOTAL_SPECIES + 1)}
            
            <div class="certificate">
                <div class="certificate-content">
                    <img src="models/Certificado_Explorador.webp" alt="Certificado Explorador" class="certificate-title" style="display:block;margin:0 auto 20px auto;max-width:350px;width:100%;">
                    <p class="certificate-text">
                        Se otorga a <strong>${user.nombre_completo}</strong> 
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
                <button id="share-whatsapp-btn" class="share-btn" style="background-color: #25d366; border: none; cursor: pointer; text-decoration: none; display: inline-block; padding: 12px 25px; border-radius: 8px; color: white; font-weight: bold;">
                    Compartir en WhatsApp
                </button>
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
            <img src="models/Escanea.webp" alt="Escanea" style="display:block;margin:0 auto 30px auto;max-width:400px;width:100%;">
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
}

