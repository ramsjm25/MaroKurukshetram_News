// Test the API fix for double /api prefix issue
const testApiFix = async () => {
  const baseUrl = 'https://marokurukshetram.vercel.app';
  
  console.log('🔧 Testing API Fix - Correct Endpoint Paths...\n');
  
  // Test languages endpoint
  console.log('📋 Testing Languages API...');
  try {
    const response = await fetch(`${baseUrl}/api/news/languages`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    console.log(`   Message: ${data.message}`);
    
    if (data.status === 1 && data.result) {
      const languages = data.result;
      console.log(`   ✅ SUCCESS: ${languages.length} languages found`);
      console.log(`   Languages:`, languages.map(lang => lang.language_name));
    } else {
      console.log(`   ❌ FAILED: ${data.message}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  // Test categories endpoint with English
  console.log('\n📋 Testing Categories API (English)...');
  try {
    const englishId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
    const response = await fetch(`${baseUrl}/api/news/categories?language_id=${englishId}`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    
    if (data.status === 1 && data.result) {
      const categories = data.result;
      console.log(`   ✅ SUCCESS: ${categories.length} categories found`);
      console.log(`   Categories:`, categories.map(cat => cat.category_name));
    } else {
      console.log(`   ❌ FAILED: ${data.message}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  // Test states endpoint with English
  console.log('\n📋 Testing States API (English)...');
  try {
    const englishId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
    const response = await fetch(`${baseUrl}/api/news/states?language_id=${englishId}`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    
    if (data.status === 1 && data.result) {
      const states = data.result;
      console.log(`   ✅ SUCCESS: ${states.length} states found`);
      console.log(`   States:`, states.map(state => state.state_name));
    } else {
      console.log(`   ❌ FAILED: ${data.message}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  // Test Tamil categories
  console.log('\n📋 Testing Categories API (Tamil)...');
  try {
    const tamilId = '46549602-7040-47a1-a717-54b780452c9b';
    const response = await fetch(`${baseUrl}/api/news/categories?language_id=${tamilId}`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    
    if (data.status === 1 && data.result) {
      const categories = data.result;
      console.log(`   ✅ SUCCESS: ${categories.length} Tamil categories found`);
      console.log(`   Categories:`, categories.map(cat => cat.category_name));
    } else {
      console.log(`   ❌ FAILED: ${data.message}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  console.log('\n🎉 API Fix Test Complete!');
  console.log('✅ All endpoints should now work without double /api prefix');
  console.log('✅ Frontend should now load languages, categories, and states properly');
};

testApiFix().catch(console.error);

