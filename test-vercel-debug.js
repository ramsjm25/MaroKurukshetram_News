// Test Vercel API with detailed debugging
const testVercelDebug = async () => {
  const tamilId = '46549602-7040-47a1-a717-54b780452c9b';
  
  console.log('🔍 Testing Vercel API with detailed debugging...\n');
  
  try {
    console.log('1. Testing with query parameters:');
    const response1 = await fetch(`https://marokurukshetram.vercel.app/api?type=categories&language_id=${tamilId}`);
    console.log(`   Status: ${response1.status}`);
    const data1 = await response1.json();
    console.log(`   Data:`, JSON.stringify(data1, null, 2));
    
    console.log('\n2. Testing with direct path:');
    const response2 = await fetch(`https://marokurukshetram.vercel.app/api/news/categories?language_id=${tamilId}`);
    console.log(`   Status: ${response2.status}`);
    const data2 = await response2.json();
    console.log(`   Data:`, JSON.stringify(data2, null, 2));
    
    console.log('\n3. Testing with different language (English):');
    const englishId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
    const response3 = await fetch(`https://marokurukshetram.vercel.app/api?type=categories&language_id=${englishId}`);
    console.log(`   Status: ${response3.status}`);
    const data3 = await response3.json();
    console.log(`   Data:`, JSON.stringify(data3, null, 2));
    
  } catch (error) {
    console.log(`Error:`, error.message);
  }
};

testVercelDebug().catch(console.error);
