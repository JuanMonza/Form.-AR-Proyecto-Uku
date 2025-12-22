# Reto Explorador Extinción - Bioparque Ukumarí

## Descripción del Proyecto

Aplicación web interactiva de Realidad Aumentada (AR) diseñada para Jardines del Renacer - Bioparque Ukumarí. Esta experiencia educativa permite a los visitantes explorar 10 especies extintas o en peligro de extinción mediante modelos 3D interactivos en realidad aumentada, completar desafíos educativos y obtener un certificado digital personalizado al finalizar el recorrido.

El proyecto combina tecnología de vanguardia con educación ambiental, ofreciendo una experiencia inmersiva que sensibiliza sobre la conservación de especies y sus hábitats.

## Características Principales

### Experiencia de Usuario
- **Realidad Aumentada**: Visualización de 10 especies en 3D con tecnología WebGL
- **Registro de Usuarios**: Sistema de registro con validación de datos y almacenamiento en Supabase
- **Seguimiento de Progreso**: Tracking individual del avance de cada usuario a través de las especies
- **Certificado Digital**: Generación automática de certificado en PDF con el nombre del explorador
- **Compartir en WhatsApp**: Función para compartir el logro en redes sociales

### Especies Incluidas
1. Dodo (Raphus cucullatus)
2. Tigre de Tasmania (Thylacinus cynocephalus)
3. Mamut Lanudo (Mammuthus primigenius)
4. Pájaro Carpintero Imperial (Campephilus imperialis)
5. Quagga (Equus quagga quagga)
6. Tigre Dientes de Sable (Smilodon fatalis)
7. Alca Gigante (Pinguinus impennis)
8. Rinoceronte Negro Occidental (Diceros bicornis longipes)
9. Tortuga de las Galápagos de Pinta (Chelonoidis abingdonii)
10. Delfín del Río Chino (Lipotes vexillifer)

### Funcionalidades Técnicas
- **Single Page Application (SPA)**: Navegación fluida sin recargas de página
- **Sistema de Routing**: Gestión de rutas y navegación interna
- **Validación de Datos**: Sanitización y normalización de inputs del usuario
- **Persistencia Local**: Uso de localStorage para mantener sesiones
- **Base de Datos en la Nube**: Integración con Supabase para almacenamiento persistente
- **Generación de PDF**: Modificación de plantillas PDF con datos dinámicos
- **Diseño Responsive**: Adaptación automática a dispositivos móviles y tablets
- **Optimización de Rendimiento**: Lazy loading, preload de recursos críticos y cache busting

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox, Grid y animaciones
- **JavaScript ES6+**: Módulos, Promises, Async/Await
- **Model Viewer**: Componente web para visualización de modelos 3D (Google)

### Backend y Base de Datos
- **Supabase**: Backend as a Service (BaaS)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - RESTful API

### Librerías Externas
- **pdf-lib v1.17.1**: Manipulación de documentos PDF en el navegador
- **@google/model-viewer**: Renderizado de modelos 3D en WebGL/AR

### Herramientas de Desarrollo
- **Git**: Control de versiones
- **GitHub**: Repositorio de código y colaboración
- **GitHub Pages**: Hosting estático y despliegue continuo

### Formatos de Archivos
- **GLB**: Modelos 3D optimizados (GL Transmission Format)
- **WebP**: Imágenes de alta calidad y bajo peso
- **PDF**: Certificados digitales

## Estructura del Proyecto

```
Form.-AR-Proyecto-Uku/
│
├── index.html                  # Punto de entrada de la aplicación
├── style.css                   # Estilos globales y componentes
├── main.js                     # Inicialización y lógica principal
├── router.js                   # Sistema de enrutamiento
├── ui.js                       # Renderizado de vistas y componentes
├── database.js                 # Lógica de base de datos y validaciones
├── supabaseClient.js          # Configuración del cliente de Supabase
├── tokenManager.js            # Gestión de sesiones de usuario
├── terms.js                   # Contenido de términos y condiciones
│
├── models/                    # Recursos multimedia
│   ├── *.glb                 # Modelos 3D de las especies
│   ├── *.webp                # Imágenes optimizadas
│   ├── *.png                 # Logos y recursos gráficos
│   └── *.pdf                 # Plantilla de certificado
│
├── .gitignore                # Archivos excluidos del repositorio
├── .env.example              # Plantilla de variables de entorno
├── supabaseClient.example.js # Plantilla de configuración
├── reset-database.sql        # Script para reiniciar la base de datos
└── README.md                 # Este archivo
```

## Arquitectura de la Aplicación

### Patrón de Diseño
La aplicación utiliza un patrón **MVC modificado** (Model-View-Controller):

- **Model**: `database.js`, `supabaseClient.js` - Gestión de datos
- **View**: `ui.js`, `index.html` - Presentación e interfaz
- **Controller**: `router.js`, `main.js` - Lógica de negocio y navegación

### Flujo de Navegación
1. Pantalla de bienvenida con información del reto
2. Registro de usuario (nombre, teléfono, ciudad)
3. Aceptación de términos y condiciones
4. Exploración secuencial de las 10 especies
5. Visualización de certificado y opciones de descarga/compartir

### Gestión de Estado
- **Sesiones**: Gestionadas mediante `SessionManager` con localStorage
- **Progreso**: Almacenado en Supabase con estructura JSONB
- **Caché**: Control mediante versioning (`?v=1.3`) para invalidación

## Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Cuenta de Supabase (para desarrollo)
- Git instalado en el sistema

### Configuración Local

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/JuanMonza/Form.-AR-Proyecto-Uku.git
cd Form.-AR-Proyecto-Uku
```

#### 2. Configurar Supabase

##### 2.1 Crear Proyecto en Supabase
1. Accede a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota la URL y la clave pública (anon key)

##### 2.2 Configurar Base de Datos
Ejecuta el script SQL en Supabase SQL Editor:
```bash
# El archivo reset-database.sql contiene toda la estructura necesaria
```

##### 2.3 Configurar Credenciales
```bash
# Copiar plantilla de ejemplo
cp supabaseClient.example.js supabaseClient.js

# Editar supabaseClient.js con tus credenciales
# Reemplazar:
# - supabaseUrl con tu URL de proyecto
# - supabaseKey con tu anon/public key
```

#### 3. Ejecutar Localmente

##### Opción A: Live Server (VS Code)
```bash
# Instalar extensión Live Server en VS Code
# Click derecho en index.html > "Open with Live Server"
```

##### Opción B: Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Acceder a: http://localhost:8000
```

##### Opción C: Node.js Server
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server -p 8000

# Acceder a: http://localhost:8000
```

### Variables de Entorno

El archivo `.env.example` contiene la plantilla de configuración:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-publica-aqui
APP_NAME=Bioparque Ukumari AR Experience
PRODUCTION_URL=https://tu-usuario.github.io/tu-repositorio
NODE_ENV=production
DB_TABLE_NAME=exploradores
```

## Base de Datos

### Estructura de la Tabla `exploradores`

| Campo            | Tipo        | Descripción                          | Constraints              |
|------------------|-------------|--------------------------------------|--------------------------|
| id               | BIGSERIAL   | Identificador único autoincrementado | PRIMARY KEY              |
| nombre_completo  | TEXT        | Nombre del explorador                | NOT NULL, >= 3 chars     |
| telefono         | TEXT        | Número de teléfono (solo dígitos)    | UNIQUE, 7-10 dígitos     |
| ciudad           | TEXT        | Ciudad de origen                     | NOT NULL, >= 2 chars     |
| progreso         | JSONB       | Estado de avance por especie         | DEFAULT '{}'             |
| created_at       | TIMESTAMPTZ | Fecha de registro                    | DEFAULT NOW()            |
| updated_at       | TIMESTAMPTZ | Última actualización                 | AUTO-UPDATED             |

### Ejemplo de Progreso (JSONB)
```json
{
  "QR_01_Completado": true,
  "QR_02_Completado": true,
  "QR_03_Completado": false,
  "QR_04_Completado": false,
  "QR_05_Completado": false,
  "QR_06_Completado": false,
  "QR_07_Completado": false,
  "QR_08_Completado": false,
  "QR_09_Completado": false,
  "QR_10_Completado": false
}
```

### Seguridad (Row Level Security)

La tabla tiene políticas RLS configuradas:
- **SELECT**: Acceso público de lectura
- **INSERT**: Permite registro de nuevos usuarios
- **UPDATE**: Permite actualizar progreso
- **DELETE**: Solo para usuarios autenticados

### Consultas Útiles

```sql
-- Ver todos los exploradores
SELECT * FROM exploradores ORDER BY created_at DESC;

-- Contar registros totales
SELECT COUNT(*) FROM exploradores;

-- Exploradores que completaron todas las especies
SELECT nombre_completo, telefono 
FROM exploradores
WHERE (progreso->>'QR_01_Completado')::boolean = true 
  AND (progreso->>'QR_10_Completado')::boolean = true;

-- Estadísticas por especie
SELECT 
    COUNT(CASE WHEN (progreso->>'QR_01_Completado')::boolean THEN 1 END) AS especie_01,
    COUNT(CASE WHEN (progreso->>'QR_02_Completado')::boolean THEN 1 END) AS especie_02
FROM exploradores;
```

## Uso de la Aplicación

### Para Visitantes

1. **Escanear QR de inicio**: Ubicado al comienzo del recorrido
2. **Registrarse**: Ingresar nombre completo, teléfono y ciudad
3. **Aceptar términos**: Leer y aceptar términos y condiciones
4. **Explorar especies**: Escanear cada QR ubicado en las exhibiciones
5. **Visualizar en AR**: Usar la cámara para ver modelos 3D en el entorno real
6. **Completar el reto**: Visitar las 10 especies
7. **Obtener certificado**: Descargar y compartir el certificado de explorador

### Para Administradores

#### Reiniciar Base de Datos
```sql
-- Ejecutar en Supabase SQL Editor
-- Ver archivo: reset-database.sql
```

#### Actualizar Contenido
```javascript
// Editar ui.js - objeto SPECIES_DATA
const SPECIES_DATA = {
    '01': {
        name: 'Nueva Especie',
        extinction: 'Año',
        habitat: 'Hábitat',
        description: 'Descripción...',
        model: 'models/modelo.glb',
        image: 'models/imagen.webp'
    }
}
```

#### Modificar Certificado
```javascript
// En main.js - función downloadCertificate()
// Ajustar coordenadas X, Y para posición del nombre
const x = (width - textWidth) / 2;
const y = height / 2 + 30;
```

## Despliegue

### GitHub Pages (Actual)

#### 1. Configuración Inicial
```bash
# Asegurarse de que la rama main/master existe
git branch -M master

# Primera subida
git add .
git commit -m "Initial commit"
git push -u origin master
```

#### 2. Habilitar GitHub Pages
1. Ir a Settings > Pages en el repositorio
2. Seleccionar rama: `master`
3. Carpeta: `/ (root)`
4. Guardar y esperar 1-2 minutos

#### 3. Actualizar Despliegue
```bash
git add .
git commit -m "Update: descripción de cambios"
git push origin master

# Los cambios se reflejan automáticamente en 1-2 minutos
```

### Cache Busting

Para forzar actualización de archivos en navegadores:
```html
<!-- Incrementar versión en index.html -->
<link rel="stylesheet" href="style.css?v=1.4">
<script type="module" src="main.js?v=1.4"></script>
```

### Otros Servicios de Hosting

#### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Seguridad

### Prácticas Implementadas

1. **Sanitización de Inputs**: Todos los datos de usuario son limpiados
2. **Validación del Lado del Servidor**: Supabase valida constraints
3. **Row Level Security**: Políticas de acceso en base de datos
4. **No Exponer Credenciales**: Uso de `.gitignore` para archivos sensibles
5. **Content Security Policy**: Headers CSP configurados
6. **HTTPS Only**: GitHub Pages usa HTTPS por defecto

### Archivos Sensibles (No Incluir en Git)

```
supabaseClient.js       # Contiene credenciales de Supabase
.env                    # Variables de entorno
.env.local              # Variables locales
config.js               # Configuraciones sensibles
credentials.json        # Credenciales generales
```

### Recomendaciones

- Nunca usar `service_role_key` en el frontend
- Solo usar `anon_key` con RLS configurado
- Renovar credenciales periódicamente
- Mantener Supabase actualizado
- Revisar logs de acceso regularmente

## Optimización de Performance

### Estrategias Implementadas

1. **Lazy Loading**: Carga diferida de imágenes y modelos
2. **Preload de Recursos Críticos**: Fuentes y CSS principales
3. **DNS Prefetch**: Resolución anticipada de dominios externos
4. **Cache Busting**: Versioning de archivos estáticos
5. **Compresión de Imágenes**: Formato WebP con alta compresión
6. **Modelos 3D Optimizados**: GLB comprimidos
7. **Minificación**: Código JavaScript optimizado
8. **Font Display Swap**: Evitar FOIT (Flash of Invisible Text)

### Métricas de Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Accesibilidad

### Características de Accesibilidad

- Contraste de colores WCAG AA compliant
- Navegación por teclado soportada
- Atributos ARIA cuando necesario
- Textos alternativos en imágenes
- Formularios con labels correctamente asociados
- Tamaños de texto responsive
- Mensajes de error claros y visibles

## Troubleshooting

### Problemas Comunes

#### Error: "No se puede conectar con Supabase"
**Solución**: Verificar que `supabaseClient.js` tiene las credenciales correctas

#### Los cambios no se reflejan en producción
**Solución**: Incrementar versión en index.html (`?v=1.4`) y hacer cache clear

#### Modelos 3D no cargan
**Solución**: Verificar que los archivos .glb están en la carpeta `models/` y son accesibles

#### El certificado no se descarga
**Solución**: Verificar que pdf-lib está cargado y que la plantilla PDF existe

#### "Teléfono ya registrado"
**Solución**: Este teléfono ya fue usado. Usar otro o recuperar sesión existente

### Logs de Debugging

```javascript
// Activar logs en la consola del navegador (F12)
// Los logs están marcados con emojis para facilitar identificación:
// - 🔌 Conexión
// - ✅ Éxito
// - ❌ Error
// - 🔄 Procesando
// - 📝 Guardando
```

## Testing

### Pruebas Manuales Recomendadas

1. **Registro de Usuario**
   - Validar campos vacíos
   - Validar formatos incorrectos
   - Probar teléfonos duplicados

2. **Navegación**
   - Probar todas las rutas
   - Verificar botones de retroceso
   - Comprobar persistencia de sesión

3. **Visualización 3D**
   - Probar en diferentes dispositivos
   - Verificar rotación de modelos
   - Comprobar botón AR en móviles compatibles

4. **Generación de Certificado**
   - Descargar PDF
   - Verificar nombre correcto
   - Probar compartir en WhatsApp

5. **Responsive**
   - Móvil (320px - 480px)
   - Tablet (481px - 768px)
   - Desktop (769px+)

### Navegadores Compatibles

- Chrome 90+ (Recomendado)
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

### Dispositivos Soportados

- iOS 12+ (iPhone, iPad)
- Android 7.0+ (Smartphones, Tablets)
- Windows 10+
- macOS 10.14+

## Contribución

### Cómo Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Convenciones de Código

#### Commits
```
Add: nueva funcionalidad
Update: mejora o modificación
Fix: corrección de bug
Remove: eliminación de código
Refactor: reestructuración sin cambios funcionales
```

#### JavaScript
- Usar ES6+ features
- CamelCase para variables y funciones
- PascalCase para clases
- Comentarios JSDoc para funciones públicas
- 4 espacios de indentación

#### CSS
- BEM naming convention cuando sea apropiado
- Mobile-first approach
- Variables CSS para colores y tamaños
- Comentarios para secciones principales

## Licencia

Este proyecto es propiedad de **Jardines del Renacer - Bioparque Ukumarí**. Todos los derechos reservados.

Copyright (c) 2025 Jardines del Renacer

## Contacto y Soporte

### Autor
**Juan Monza**
- GitHub: [@JuanMonza](https://github.com/JuanMonza)
- Repositorio: [Form.-AR-Proyecto-Uku](https://github.com/JuanMonza/Form.-AR-Proyecto-Uku)

### Bioparque Ukumarí
- Sitio Web: [Bioparque Ukumarí](https://bioparqueukumari.com)
- Ubicación: Pereira, Colombia

### Reportar Problemas

Para reportar bugs o sugerir mejoras, abrir un issue en:
[https://github.com/JuanMonza/Form.-AR-Proyecto-Uku/issues](https://github.com/JuanMonza/Form.-AR-Proyecto-Uku/issues)

## Agradecimientos

- Google Model Viewer por la tecnología de visualización 3D
- Supabase por la infraestructura de backend
- pdf-lib por la manipulación de PDFs
- Comunidad de desarrolladores web por recursos y documentación

## Changelog

### Versión 1.3 (Actual)
- Implementación completa de 10 especies
- Sistema de certificados PDF con nombre personalizado
- Integración de WhatsApp share
- Footer con enlaces informativos
- Optimización de base de datos
- Sistema de seguridad mejorado con .gitignore
- Documentación completa del proyecto

### Versión 1.2
- Corrección de issues de cache en despliegue
- Mejora en inicialización de botones
- Eliminación de efectos zoom no deseados

### Versión 1.1
- Sistema de registro y autenticación
- Integración con Supabase
- 9 especies iniciales
- Diseño responsive completo

### Versión 1.0
- Release inicial
- Estructura básica de la aplicación
- Sistema de routing
- Primeras 5 especies

---

**Última actualización**: Diciembre 2025  
**Versión**: 1.3  
**Estado**: Producción
