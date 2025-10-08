// Comprehensive test script for production APIs
const testProductionAPIs = async () => {
  // Replace with your actual Vercel domain
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-domain.vercel.app';
  
  console.log('🧪 Testing Production APIs...\n');
  console.log(`Testing against: ${baseUrl}\n`);
  
  const testResults = {
    languages: { success: false, count: 0, error: null },
    categories: { success: false, count: 0, error: null },
    states: { success: false, count: 0, error: null },
    districts: { success: false, count: 0, error: null },
    news: { success: false, count: 0, error: null }
  };
  
  try {
    // Test 1: Languages
    console.log('1. Testing Languages API...');
    try {
      const languagesResponse = await fetch(`${baseUrl}/api?type=languages`);
      const languagesData = await languagesResponse.json();
      
      if (languagesData.status === 1 && languagesData.result) {
        testResults.languages = { 
          success: true, 
          count: languagesData.result.length,
          error: null 
        };
        console.log(`✅ Languages: SUCCESS - ${languagesData.result.length} items`);
        console.log(`   Languages: ${languagesData.result.map(l => l.language_name).join(', ')}`);
      } else {
        testResults.languages.error = languagesData.message || 'Invalid response';
        console.log(`❌ Languages: FAILED - ${testResults.languages.error}`);
      }
    } catch (error) {
      testResults.languages.error = error.message;
      console.log(`❌ Languages: ERROR - ${error.message}`);
    }
    
    // Test 2: Categories (using first language)
    if (testResults.languages.success) {
      console.log('\n2. Testing Categories API...');
      try {
        const languageId = '5dd95034-d533-4b09-8687-cd2ed3682ab6'; // English language ID
        const categoriesResponse = await fetch(`${baseUrl}/api?type=categories&language_id=${languageId}`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.status === 1 && categoriesData.result) {
          testResults.categories = { 
            success: true, 
            count: categoriesData.result.length,
            error: null 
          };
          console.log(`✅ Categories: SUCCESS - ${categoriesData.result.length} items`);
          console.log(`   Categories: ${categoriesData.result.map(c => c.category_name).join(', ')}`);
        } else {
          testResults.categories.error = categoriesData.message || 'Invalid response';
          console.log(`❌ Categories: FAILED - ${testResults.categories.error}`);
        }
      } catch (error) {
        testResults.categories.error = error.message;
        console.log(`❌ Categories: ERROR - ${error.message}`);
      }
    }
    
    // Test 3: States
    if (testResults.languages.success) {
      console.log('\n3. Testing States API...');
      try {
        const languageId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
        const statesResponse = await fetch(`${baseUrl}/api?type=states&language_id=${languageId}`);
        const statesData = await statesResponse.json();
        
        if (statesData.status === 1 && statesData.result) {
          testResults.states = { 
            success: true, 
            count: statesData.result.length,
            error: null 
          };
          console.log(`✅ States: SUCCESS - ${statesData.result.length} items`);
          console.log(`   States: ${statesData.result.map(s => s.state_name).join(', ')}`);
        } else {
          testResults.states.error = statesData.message || 'Invalid response';
          console.log(`❌ States: FAILED - ${testResults.states.error}`);
        }
      } catch (error) {
        testResults.states.error = error.message;
        console.log(`❌ States: ERROR - ${error.message}`);
      }
    }
    
    // Test 4: Districts (using first state)
    if (testResults.states.success) {
      console.log('\n4. Testing Districts API...');
      try {
        const languageId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
        const stateId = 'b6be8d5c-f276-4d63-b878-6fc765180ccf'; // Telangana state ID
        const districtsResponse = await fetch(`${baseUrl}/api?type=districts&language_id=${languageId}&state_id=${stateId}`);
        const districtsData = await districtsResponse.json();
        
        if (districtsData.status === 1 && districtsData.result) {
          testResults.districts = { 
            success: true, 
            count: districtsData.result.length,
            error: null 
          };
          console.log(`✅ Districts: SUCCESS - ${districtsData.result.length} items`);
          console.log(`   Districts: ${districtsData.result.map(d => d.name).join(', ')}`);
        } else {
          testResults.districts.error = districtsData.message || 'Invalid response';
          console.log(`❌ Districts: FAILED - ${testResults.districts.error}`);
        }
      } catch (error) {
        testResults.districts.error = error.message;
        console.log(`❌ Districts: ERROR - ${error.message}`);
      }
    }
    
    // Test 5: News Filter
    if (testResults.categories.success) {
      console.log('\n5. Testing News Filter API...');
      try {
        const languageId = '5dd95034-d533-4b09-8687-cd2ed3682ab6';
        const newsResponse = await fetch(`${baseUrl}/api/news/filter-advanced?language_id=${languageId}&limit=5`);
        const newsData = await newsResponse.json();
        
        if (newsResponse.status === 200 && newsData.result) {
          testResults.news = { 
            success: true, 
            count: newsData.result.items?.length || 0,
            error: null 
          };
          console.log(`✅ News Filter: SUCCESS - ${testResults.news.count} items`);
        } else {
          testResults.news.error = newsData.message || 'Invalid response';
          console.log(`❌ News Filter: FAILED - ${testResults.news.error}`);
        }
      } catch (error) {
        testResults.news.error = error.message;
        console.log(`❌ News Filter: ERROR - ${error.message}`);
      }
    }
    
    // Test 6: Test API endpoint
    console.log('\n6. Testing Test API endpoint...');
    try {
      const testResponse = await fetch(`${baseUrl}/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
      const testData = await testResponse.json();
      console.log(`✅ Test API: SUCCESS - ${testData.filteredCategories || 0} categories`);
    } catch (error) {
      console.log(`❌ Test API: ERROR - ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Overall test failed:', error.message);
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  Object.entries(testResults).forEach(([key, result]) => {
    const status = result.success ? '✅' : '❌';
    const count = result.success ? result.count : 0;
    const error = result.error ? ` (${result.error})` : '';
    console.log(`${status} ${key.toUpperCase()}: ${count} items${error}`);
  });
  
  const allSuccess = Object.values(testResults).every(r => r.success);
  console.log(`\n🎯 Overall Status: ${allSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return testResults;
};

// Run the test
testProductionAPIs().catch(console.error);
