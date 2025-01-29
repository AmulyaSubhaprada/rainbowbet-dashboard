
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://blwnzaflsqbyfxxpdfnj.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsd256YWZsc3FieWZ4eHBkZm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwMTY0NjksImV4cCI6MjA0NTU5MjQ2OX0.HhEf1bACZhkCc0HlLkyrBXJnyX_8M-KbSy47chuWmBU"
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;