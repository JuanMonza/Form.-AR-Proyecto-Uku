-- Borra la tabla actual y crea una nueva con IDs 1,2,3... y hora de Colombia

DROP TABLE IF EXISTS exploradores CASCADE;

CREATE TABLE exploradores (
  id SERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  telefono TEXT UNIQUE NOT NULL,
  ciudad TEXT NOT NULL,
  progreso JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'America/Bogota')
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_exploradores_telefono ON exploradores(telefono);
CREATE INDEX idx_exploradores_created_at ON exploradores(created_at);

-- Habilitar seguridad de filas
ALTER TABLE exploradores ENABLE ROW LEVEL SECURITY;

-- Permitir acceso público (puedes ajustar esto después)
CREATE POLICY "Permitir todo publico" ON exploradores
  FOR ALL USING (true) WITH CHECK (true);

-- Verificar que todo está correcto
SELECT 
  id,
  nombre_completo,
  telefono,
  ciudad,
  created_at AT TIME ZONE 'America/Bogota' as hora_colombia
FROM exploradores
ORDER BY id DESC
LIMIT 10;
