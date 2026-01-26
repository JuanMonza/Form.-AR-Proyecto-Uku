import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.43.4/+esm';

const supabaseUrl = 'https://iypktjmnerhyouqmimnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cGt0am1uZXJoeW91cW1pbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjcyMzcsImV4cCI6MjA3NzMwMzIzN30.50ngWUO78Lxm6uEw0NWySOgwOyTj7bdOkvay2V4r2KA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test de conexión
console.log('🔌 Intentando conectar con Supabase...');
supabase.from('exploradores').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('❌ Error de conexión con Supabase:', error);
        } else {
            console.log('✅ Conexión exitosa con Supabase. Total de registros:', count);
        }
    });
