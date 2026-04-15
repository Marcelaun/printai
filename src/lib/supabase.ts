import { createClient } from '@supabase/supabase-js';

// Substitua com os seus dados reais do projeto Supabase
const supabaseUrl = 'https://oaywdwgzkkzmdibmovio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heXdkd2d6a2t6bWRpYm1vdmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjk4NzAsImV4cCI6MjA5MTYwNTg3MH0.Bd0m5JeIQHfpgh3-bNO-vpJ-kjgJu52FL4ZwdfY7wxw';

export const supabase = createClient(supabaseUrl, supabaseKey);
