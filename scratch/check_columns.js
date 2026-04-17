const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wzbyoeyvnoheqotwnncm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YnlvZXl2bm9oZXFvdHdubmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzMzMTAsImV4cCI6MjA5MTg0OTMxMH0.olZZAIzotaQz5ky1-5jttsicAJhCy1zaba3bA4g7pMQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log("Fetching one row from orders...");
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error("Error fetching order:", error.message);
  } else if (data && data.length > 0) {
    console.log("Order Columns:", Object.keys(data[0]));
  } else {
    console.log("Orders table is empty, creating a test record...");
    // We can't easily create a record without valid userId etc.
    // Let's try to get table info via RPC or just assume my previous guesses were wrong.
  }

  console.log("Fetching one row from products...");
  const { data: pData, error: pError } = await supabase.from('products').select('*').limit(1);
  if (pData && pData.length > 0) {
    console.log("Product Columns:", Object.keys(pData[0]));
  } else {
    console.log("Products table is empty.");
  }
}

checkColumns();
