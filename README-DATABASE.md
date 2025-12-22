Guía de Base de Datos - Bioparque Ukumarí AR

Tabla de Contenidos

1. [Estructura de la Base de Datos](#estructura)
2. [Reiniciar la Base de Datos](#reiniciar)
3. [Seguridad y Configuración](#seguridad)
4. [Consultas Útiles](#consultas)
5. [Solución de Problemas](#problemas)

---

Estructura de la Base de Datos {#estructura}

Tabla: `exploradores`

| Campo            | Tipo      | Descripción                                    | Constraints                    |
|------------------|-----------|------------------------------------------------|--------------------------------|
| `id`             | BIGSERIAL | ID único autoincrementado                      | PRIMARY KEY                    |
| `nombre_completo`| TEXT      | Nombre completo del explorador                 | NOT NULL, >= 3 caracteres      |
| `telefono`       | TEXT      | Número de teléfono (solo dígitos)              | UNIQUE, 7-10 dígitos           |
| `ciudad`         | TEXT      | Ciudad de origen                               | NOT NULL, >= 2 caracteres      |
| `progreso`       | JSONB     | Estado de avance por especie                   | DEFAULT '{}'                   |
| `created_at`     | TIMESTAMPTZ| Fecha de registro                             | DEFAULT NOW()                  |
| `updated_at`     | TIMESTAMPTZ| Última actualización                          | DEFAULT NOW(), auto-updated    |

### Ejemplo de `progreso`:
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

---

Reiniciar la Base de Datos {#reiniciar}

Opción 1: Usando Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. Navega a **SQL Editor** en el menú lateral
3. Copia y pega el contenido completo de `reset-database.sql`
4. Haz clic en **Run** (▶️)
5. Verifica el mensaje de éxito

Usando Supabase CLI

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Ejecutar el script de reinicio
supabase db reset --db-url "postgresql://usuario:password@host:puerto/database"
```

ADVERTENCIA

**Este proceso ELIMINA TODOS LOS DATOS EXISTENTES**. Solo úsalo cuando:
- Necesites empezar desde cero
- Quieras limpiar datos de prueba
- Hayas cambiado la estructura de la tabla

**Antes de ejecutar:**
1. Haz un respaldo de los datos importantes
2. Confirma que realmente quieres eliminar todo
3. Notifica a tu equipo si es un ambiente compartido

---

Seguridad y Configuración {#seguridad}

Configuración Inicial
1. Crear archivo de credenciales (PRIMERA VEZ)

```bash
# Copiar plantilla de ejemplo
cp supabaseClient.example.js supabaseClient.js
```

2. Obtener credenciales de Supabase

1. Ve a tu proyecto: https://app.supabase.com/project/_/settings/api
2. Copia:
   - **Project URL** (supabaseUrl)
   - **anon/public key** (supabaseKey)

3. Editar `supabaseClient.js`

```javascript
const supabaseUrl = 'https://tu-proyecto-real.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5c... tu clave completa aquí';
```

Verificar .gitignore

Asegúrate de que `.gitignore` incluye:
```
supabaseClient.js
.env
.env.local
config.js
```

Row Level Security (RLS)

El script `reset-database.sql` configura automáticamente:

- Lectura pública (SELECT)
- Inserción pública (INSERT)
- Actualización pública (UPDATE)
- Eliminación (DELETE) - requiere autenticación

**Para modificar políticas:**
```sql
-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'exploradores';

-- Ejemplo: Restringir actualizaciones
DROP POLICY IF EXISTS "Permitir actualización pública" ON exploradores;
CREATE POLICY "Actualización restringida"
    ON exploradores
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);
```

---

Consultas Útiles {#consultas}
Consultas Básicas

```sql
-- Ver todos los exploradores
SELECT * FROM exploradores ORDER BY created_at DESC;

-- Contar total de registros
SELECT COUNT(*) FROM exploradores;

-- Ver registros de hoy
SELECT * FROM exploradores 
WHERE created_at >= CURRENT_DATE 
ORDER BY created_at DESC;

-- Buscar por teléfono
SELECT * FROM exploradores WHERE telefono = '3001234567';

-- Buscar por ciudad
SELECT * FROM exploradores WHERE ciudad ILIKE '%pereira%';
```

Consultas de Progreso

```sql
-- Exploradores que completaron todas las especies
SELECT nombre_completo, telefono, progreso
FROM exploradores
WHERE 
    (progreso->>'QR_01_Completado')::boolean = true AND
    (progreso->>'QR_02_Completado')::boolean = true AND
    (progreso->>'QR_03_Completado')::boolean = true AND
    (progreso->>'QR_04_Completado')::boolean = true AND
    (progreso->>'QR_05_Completado')::boolean = true AND
    (progreso->>'QR_06_Completado')::boolean = true AND
    (progreso->>'QR_07_Completado')::boolean = true AND
    (progreso->>'QR_08_Completado')::boolean = true AND
    (progreso->>'QR_09_Completado')::boolean = true AND
    (progreso->>'QR_10_Completado')::boolean = true;

-- Contar exploradores por especie completada
SELECT 
    COUNT(CASE WHEN (progreso->>'QR_01_Completado')::boolean THEN 1 END) AS especie_01,
    COUNT(CASE WHEN (progreso->>'QR_02_Completado')::boolean THEN 1 END) AS especie_02,
    COUNT(CASE WHEN (progreso->>'QR_03_Completado')::boolean THEN 1 END) AS especie_03,
    COUNT(CASE WHEN (progreso->>'QR_04_Completado')::boolean THEN 1 END) AS especie_04,
    COUNT(CASE WHEN (progreso->>'QR_05_Completado')::boolean THEN 1 END) AS especie_05,
    COUNT(CASE WHEN (progreso->>'QR_06_Completado')::boolean THEN 1 END) AS especie_06,
    COUNT(CASE WHEN (progreso->>'QR_07_Completado')::boolean THEN 1 END) AS especie_07,
    COUNT(CASE WHEN (progreso->>'QR_08_Completado')::boolean THEN 1 END) AS especie_08,
    COUNT(CASE WHEN (progreso->>'QR_09_Completado')::boolean THEN 1 END) AS especie_09,
    COUNT(CASE WHEN (progreso->>'QR_10_Completado')::boolean THEN 1 END) AS especie_10
FROM exploradores;

-- Promedio de especies completadas por usuario
SELECT 
    nombre_completo,
    telefono,
    (
        (CASE WHEN (progreso->>'QR_01_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_02_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_03_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_04_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_05_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_06_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_07_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_08_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_09_Completado')::boolean THEN 1 ELSE 0 END) +
        (CASE WHEN (progreso->>'QR_10_Completado')::boolean THEN 1 ELSE 0 END)
    ) AS especies_completadas
FROM exploradores
ORDER BY especies_completadas DESC;
```

Consultas de Administración

```sql
-- Respaldo de datos (exportar como CSV)
COPY (SELECT * FROM exploradores) TO '/tmp/respaldo_exploradores.csv' WITH CSV HEADER;

-- Eliminar usuarios sin progreso
DELETE FROM exploradores 
WHERE progreso = '{}'::jsonb 
AND created_at < NOW() - INTERVAL '7 days';

-- Limpiar teléfonos duplicados (mantener el más reciente)
DELETE FROM exploradores a
USING exploradores b
WHERE a.id < b.id 
AND a.telefono = b.telefono;
```

---

Solución de Problemas {#problemas}

Error: "relation 'exploradores' does not exist"

**Causa:** La tabla no ha sido creada.

**Solución:**
```sql
-- Ejecutar reset-database.sql completo en Supabase SQL Editor
```

Error: "duplicate key value violates unique constraint"

**Causa:** Intentando insertar un teléfono que ya existe.

**Solución:**
```javascript
// En tu código, verificar primero si el usuario existe
const existingUser = await db.getUser(telefono);
if (existingUser) {
    console.log('Usuario ya registrado');
    // Continuar con el usuario existente
}
```

Error: "new row violates row-level security policy"

**Causa:** Las políticas de RLS están bloqueando la operación.

**Solución:**
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'exploradores';

-- Volver a crear políticas con reset-database.sql
```

Error: "column 'QR_11_Completado' does not exist"

**Causa:** Intentando acceder a una especie que no existe en el progreso.

**Solución:**
```javascript
// Actualizar database.js para incluir QR_11
for (let i = 1; i <= 10; i++) { // Cambiar de 9 a 10 (o el número correcto)
    const speciesId = `0${i}`.slice(-2);
    initialProgress[`QR_${speciesId}_Completado`] = false;
}
```

Conexión muy lenta

**Posibles causas:**
1. Red lenta o inestable
2. Muchos registros sin índices
3. Consultas complejas sin optimizar

**Soluciones:**
```sql
-- Verificar índices
SELECT * FROM pg_indexes WHERE tablename = 'exploradores';

-- Crear índices adicionales si es necesario
CREATE INDEX idx_exploradores_nombre ON exploradores(nombre_completo);
CREATE INDEX idx_exploradores_ciudad ON exploradores(ciudad);

-- Analizar rendimiento de consultas
EXPLAIN ANALYZE SELECT * FROM exploradores WHERE telefono = '3001234567';
```

---

Soporte

Si tienes problemas:

1. **Verifica la consola del navegador** (F12) para ver errores
2. **Revisa los logs de Supabase**: https://app.supabase.com/project/_/logs
3. **Consulta la documentación**: https://supabase.com/docs
4. **Verifica que supabaseClient.js tiene las credenciales correctas**

---

Checklist de Seguridad

Antes de desplegar a producción:

- [ ] ✅ `.gitignore` incluye `supabaseClient.js`
- [ ] ✅ No hay credenciales en GitHub
- [ ] ✅ RLS está habilitado en la tabla
- [ ] ✅ Políticas de seguridad están configuradas
- [ ] ✅ Solo usas `anon key` (no `service_role key`)
- [ ] ✅ Validaciones en frontend y backend
- [ ] ✅ Respaldo de datos antes de cambios importantes

---

**Última actualización:** Diciembre 2025  
**Proyecto:** Bioparque Ukumarí - Experiencia AR  
**Versión:** 1.3
