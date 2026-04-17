const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wzbyoeyvnoheqotwnncm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YnlvZXl2bm9oZXFvdHdubmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzMzMTAsImV4cCI6MjA5MTg0OTMxMH0.olZZAIzotaQz5ky1-5jttsicAJhCy1zaba3bA4g7pMQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const tables = ['products', 'orders', 'order_items'];
  
  for (const table of tables) {
    console.log(`--- Table: ${table} ---`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      continue;
    }
    if (data && data.length > 0) {
      console.log(`Columns:`, Object.keys(data[0]));
    } else {
      console.log(`Table is empty.`);
    }
  }
}

checkSchema();
