const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wzbyoeyvnoheqotwnncm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YnlvZXl2bm9oZXFvdHdubmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzMzMTAsImV4cCI6MjA5MTg0OTMxMH0.olZZAIzotaQz5ky1-5jttsicAJhCy1zaba3bA4g7pMQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("Checking products table...");
  const { data: pData, error: pError } = await supabase.from('products').select('*').limit(1);
  if (pError) console.error("Products error:", pError.message);
  else console.log("Products table exists.");

  console.log("Checking orders table...");
  const { data: oData, error: oError } = await supabase.from('orders').select('*').limit(1);
  if (oError) console.error("Orders error:", oError.message);
  else console.log("Orders table exists.");

  console.log("Checking order_items table...");
  const { data: iData, error: iError } = await supabase.from('order_items').select('*').limit(1);
  if (iError) console.error("Order_items error:", iError.message);
  else console.log("Order_items table exists.");
}

checkSchema();
