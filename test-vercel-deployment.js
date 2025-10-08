// Test Vercel deployment to identify the exact issue
const testVercelDeployment = async () => {
  const baseUrl = 'https://marokurukshetram.vercel.app';
  
  console.log('🔍 Testing Vercel Deployment - Identifying Issues...\n');
  
  // Test 1: Health check
  console.log('📋 Test 1: Health Check...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Health: ${data.status}`);
    console.log(`   External API Working: ${data.externalApi?.working}`);
    console.log(`   Languages Count: ${data.externalApi?.languagesCount}`);
  } catch (error) {
    console.log(`   ❌ Health Check Failed: ${error.message}`);
  }
  
  // Test 2: Languages API
  console.log('\n📋 Test 2: Languages API...');
  try {
    const response = await fetch(`${baseUrl}/api/news/languages`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    console.log(`   Message: ${data.message}`);
    if (data.result) {
      console.log(`   Languages Count: ${data.result.length}`);
      console.log(`   Languages:`, data.result.map(l => l.language_name));
    }
  } catch (error) {
    console.log(`   ❌ Languages API Failed: ${error.message}`);
  }
  
  // Test 3: Categories API (English)
  console.log('\n📋 Test 3: Categories API (English)...');
  try {
    const englishId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
    const response = await fetch(`${baseUrl}/api/news/categories?language_id=${englishId}`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    console.log(`   Message: ${data.message}`);
    if (data.result) {
      console.log(`   Categories Count: ${data.result.length}`);
      console.log(`   Categories:`, data.result.map(c => c.category_name));
    }
  } catch (error) {
    console.log(`   ❌ Categories API Failed: ${error.message}`);
  }
  
  // Test 4: States API (English)
  console.log('\n📋 Test 4: States API (English)...');
  try {
    const englishId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
    const response = await fetch(`${baseUrl}/api/news/states?language_id=${englishId}`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    console.log(`   Message: ${data.message}`);
    if (data.result) {
      console.log(`   States Count: ${data.result.length}`);
      console.log(`   States:`, data.result.map(s => s.state_name));
    }
  } catch (error) {
    console.log(`   ❌ States API Failed: ${error.message}`);
  }
  
  // Test 5: News Filter API
  console.log('\n📋 Test 5: News Filter API...');
  try {
    const englishId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
    const politicsId = '40c4b7ab-c38a-4cdc-9d97-6db86ec6d598';
    const response = await fetch(`${baseUrl}/api/news/filter-multi-categories?language_id=${englishId}&categoryIds=${politicsId}&limit=5`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    console.log(`   Message: ${data.message}`);
    if (data.result) {
      const items = data.result.items || data.result;
      console.log(`   News Count: ${Array.isArray(items) ? items.length : 'N/A'}`);
    }
  } catch (error) {
    console.log(`   ❌ News Filter API Failed: ${error.message}`);
  }
  
  // Test 6: Direct external API (bypass Vercel)
  console.log('\n📋 Test 6: Direct External API (Bypass Vercel)...');
  try {
    const response = await fetch('https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/languages');
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   API Status: ${data.status}`);
    if (data.result) {
      console.log(`   Direct API Languages Count: ${data.result.length}`);
    }
  } catch (error) {
    console.log(`   ❌ Direct External API Failed: ${error.message}`);
  }
  
  console.log('\n🎯 Analysis Complete!');
};

testVercelDeployment().catch(console.error);
