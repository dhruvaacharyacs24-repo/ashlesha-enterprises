const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wzbyoeyvnoheqotwnncm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YnlvZXl2bm9oZXFvdHdubmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzMzMTAsImV4cCI6MjA5MTg0OTMxMH0.olZZAIzotaQz5ky1-5jttsicAJhCy1zaba3bA4g7pMQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) console.error(error.message);
  else console.log(JSON.stringify(data, null, 2));
}

dumpProducts();
