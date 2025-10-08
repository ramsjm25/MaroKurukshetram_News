// Comprehensive Vercel API Test Script
const testVercelComplete = async () => {
  // Replace with your actual Vercel domain
  const baseUrl = 'https://marokurukshetram.vercel.app'; // Update this with your actual domain
  
  console.log('🚀 COMPREHENSIVE VERCEL API TEST');
  console.log('================================');
  console.log(`Testing: ${baseUrl}`);
  console.log('Time:', new Date().toISOString());
  console.log('');
  
  const results = {
    health: { success: false, data: null, error: null },
    languages: { success: false, count: 0, error: null },
    categories: { success: false, count: 0, error: null },
    states: { success: false, count: 0, error: null },
    districts: { success: false, count: 0, error: null },
    news: { success: false, count: 0, error: null }
  };
  
  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'healthy') {
      results.health = { success: true, data: data, error: null };
      console.log('✅ Health Check: SUCCESS');
      console.log(`   External API Working: ${data.externalApi?.working ? 'YES' : 'NO'}`);
      console.log(`   Languages Available: ${data.externalApi?.languagesCount || 0}`);
    } else {
      results.health = { success: false, data: data, error: 'Unhealthy response' };
      console.log('❌ Health Check: FAILED');
    }
  } catch (error) {
    results.health = { success: false, data: null, error: error.message };
    console.log('❌ Health Check: ERROR -', error.message);
  }
  
  // Test 2: Languages API
  console.log('\n2️⃣ Testing Languages API...');
  try {
    const response = await fetch(`${baseUrl}/api?type=languages`);
    const data = await response.json();
    
    if (data.status === 1 && data.result && data.result.length > 0) {
      results.languages = { success: true, count: data.result.length, error: null };
      console.log(`✅ Languages: SUCCESS - ${data.result.length} languages`);
      console.log(`   Languages: ${data.result.map(l => l.language_name).join(', ')}`);
    } else {
      results.languages = { success: false, count: 0, error: data.message || 'No languages' };
      console.log('❌ Languages: FAILED -', results.languages.error);
    }
  } catch (error) {
    results.languages = { success: false, count: 0, error: error.message };
    console.log('❌ Languages: ERROR -', error.message);
  }
  
  // Test 3: Categories API
  console.log('\n3️⃣ Testing Categories API...');
  try {
    const response = await fetch(`${baseUrl}/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    
    if (data.status === 1 && data.result && data.result.length > 0) {
      results.categories = { success: true, count: data.result.length, error: null };
      console.log(`✅ Categories: SUCCESS - ${data.result.length} categories`);
      console.log(`   Categories: ${data.result.map(c => c.category_name).join(', ')}`);
    } else {
      results.categories = { success: false, count: 0, error: data.message || 'No categories' };
      console.log('❌ Categories: FAILED -', results.categories.error);
    }
  } catch (error) {
    results.categories = { success: false, count: 0, error: error.message };
    console.log('❌ Categories: ERROR -', error.message);
  }
  
  // Test 4: States API
  console.log('\n4️⃣ Testing States API...');
  try {
    const response = await fetch(`${baseUrl}/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    
    if (data.status === 1 && data.result && data.result.length > 0) {
      results.states = { success: true, count: data.result.length, error: null };
      console.log(`✅ States: SUCCESS - ${data.result.length} states`);
      console.log(`   States: ${data.result.map(s => s.state_name).join(', ')}`);
    } else {
      results.states = { success: false, count: 0, error: data.message || 'No states' };
      console.log('❌ States: FAILED -', results.states.error);
    }
  } catch (error) {
    results.states = { success: false, count: 0, error: error.message };
    console.log('❌ States: ERROR -', error.message);
  }
  
  // Test 5: Districts API (if states are available)
  if (results.states.success) {
    console.log('\n5️⃣ Testing Districts API...');
    try {
      const response = await fetch(`${baseUrl}/api?type=districts&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6&state_id=b6be8d5c-f276-4d63-b878-6fc765180ccf`);
      const data = await response.json();
      
      if (data.status === 1 && data.result && data.result.length > 0) {
        results.districts = { success: true, count: data.result.length, error: null };
        console.log(`✅ Districts: SUCCESS - ${data.result.length} districts`);
        console.log(`   Districts: ${data.result.map(d => d.name).join(', ')}`);
      } else {
        results.districts = { success: false, count: 0, error: data.message || 'No districts' };
        console.log('❌ Districts: FAILED -', results.districts.error);
      }
    } catch (error) {
      results.districts = { success: false, count: 0, error: error.message };
      console.log('❌ Districts: ERROR -', error.message);
    }
  }
  
  // Test 6: News Filter API
  if (results.categories.success) {
    console.log('\n6️⃣ Testing News Filter API...');
    try {
      const response = await fetch(`${baseUrl}/api/news/filter-advanced?language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6&limit=5`);
      const data = await response.json();
      
      if (response.status === 200 && data.result) {
        results.news = { success: true, count: data.result.items?.length || 0, error: null };
        console.log(`✅ News Filter: SUCCESS - ${results.news.count} news items`);
      } else {
        results.news = { success: false, count: 0, error: data.message || 'No news' };
        console.log('❌ News Filter: FAILED -', results.news.error);
      }
    } catch (error) {
      results.news = { success: false, count: 0, error: error.message };
      console.log('❌ News Filter: ERROR -', error.message);
    }
  }
  
  // Test 7: Test API Endpoint
  console.log('\n7️⃣ Testing Test API Endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    
    if (response.status === 200) {
      console.log(`✅ Test API: SUCCESS - ${data.filteredCategories || 0} categories`);
    } else {
      console.log('❌ Test API: FAILED -', data.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Test API: ERROR -', error.message);
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Health Check: ${results.health.success ? '✅' : '❌'}`);
  console.log(`Languages: ${results.languages.success ? '✅' : '❌'} (${results.languages.count})`);
  console.log(`Categories: ${results.categories.success ? '✅' : '❌'} (${results.categories.count})`);
  console.log(`States: ${results.states.success ? '✅' : '❌'} (${results.states.count})`);
  console.log(`Districts: ${results.districts.success ? '✅' : '❌'} (${results.districts.count})`);
  console.log(`News: ${results.news.success ? '✅' : '❌'} (${results.news.count})`);
  
  const allCriticalSuccess = results.languages.success && results.categories.success && results.states.success;
  console.log(`\n🎯 Overall Status: ${allCriticalSuccess ? '✅ ALL CRITICAL APIS WORKING' : '❌ SOME APIS FAILING'}`);
  
  if (allCriticalSuccess) {
    console.log('\n🎉 SUCCESS! Your APIs are working on Vercel!');
    console.log('✅ News sections should now load with content');
    console.log('✅ Default selections should work');
    console.log('✅ All functionality should work as expected');
  } else {
    console.log('\n⚠️  Some APIs are still failing. Check the errors above.');
    console.log('💡 Try waiting 5-10 minutes for full deployment');
    console.log('💡 Check Vercel function logs in dashboard');
  }
  
  return results;
};

// Run the test
testVercelComplete().catch(console.error);
