export default () => ({
  dbPort: parseInt(process.env.DB_PORT, 10) || 5432,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
});
