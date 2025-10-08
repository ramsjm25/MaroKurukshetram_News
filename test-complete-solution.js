// Test complete solution with direct path APIs
const testCompleteSolution = async () => {
  const baseUrl = 'https://marokurukshetram.vercel.app';
  
  console.log('🚀 Testing COMPLETE SOLUTION - All Languages + Header Dropdown...\n');
  
  const languages = [
    { id: '5dd95034-d533-4b09-8687-cd2ed3682ab6', name: 'English' },
    { id: '46549602-7040-47a1-a717-54b780452c9b', name: 'Tamil (தமிழ்)' },
    { id: '8790bfb1-e207-4595-9453-f9c8d7387bbf', name: 'Kannada (ಕನ್ನಡ)' },
    { id: '90255d91-aead-47c9-ba76-ea85e75dc68b', name: 'Telugu (తెలుగు)' },
    { id: 'bde74321-ee95-42c6-b7ed-de865b65968d', name: 'Hindi (हिंदी)' }
  ];
  
  let allPassed = true;
  let results = {};
  
  for (const lang of languages) {
    console.log(`\n📋 Testing ${lang.name} (${lang.id})...`);
    
    try {
      // Test Categories API
      const categoriesResponse = await fetch(`${baseUrl}/api/news/categories?language_id=${lang.id}`);
      const categoriesData = await categoriesResponse.json();
      
      console.log(`   Categories Status: ${categoriesResponse.status}`);
      console.log(`   Categories Count: ${Array.isArray(categoriesData.result) ? categoriesData.result.length : 0}`);
      
      if (categoriesData.status === 1 && categoriesData.result && Array.isArray(categoriesData.result) && categoriesData.result.length > 0) {
        console.log(`   ✅ Categories: SUCCESS - ${categoriesData.result.length} items`);
        console.log(`   Categories:`, categoriesData.result.map(cat => cat.category_name));
        results[`${lang.name} - Categories`] = { status: 'SUCCESS', count: categoriesData.result.length };
      } else {
        console.log(`   ❌ Categories: FAILED - ${categoriesData.result?.length || 0} items`);
        allPassed = false;
        results[`${lang.name} - Categories`] = { status: 'FAILED', count: categoriesData.result?.length || 0 };
      }
      
      // Test States API
      const statesResponse = await fetch(`${baseUrl}/api/news/states?language_id=${lang.id}`);
      const statesData = await statesResponse.json();
      
      console.log(`   States Status: ${statesResponse.status}`);
      console.log(`   States Count: ${Array.isArray(statesData.result) ? statesData.result.length : 0}`);
      
      if (statesData.status === 1 && statesData.result && Array.isArray(statesData.result) && statesData.result.length > 0) {
        console.log(`   ✅ States: SUCCESS - ${statesData.result.length} items`);
        console.log(`   States:`, statesData.result.map(state => state.state_name));
        results[`${lang.name} - States`] = { status: 'SUCCESS', count: statesData.result.length };
      } else {
        console.log(`   ❌ States: FAILED - ${statesData.result?.length || 0} items`);
        allPassed = false;
        results[`${lang.name} - States`] = { status: 'FAILED', count: statesData.result?.length || 0 };
      }
      
      // Test Districts API (only if we have states)
      if (statesData.result && statesData.result.length > 0) {
        const stateId = statesData.result[0].id;
        const districtsResponse = await fetch(`${baseUrl}/api/news/districts?language_id=${lang.id}&state_id=${stateId}`);
        const districtsData = await districtsResponse.json();
        
        console.log(`   Districts Status: ${districtsResponse.status}`);
        console.log(`   Districts Count: ${Array.isArray(districtsData.result) ? districtsData.result.length : 0}`);
        
        if (districtsData.status === 1 && districtsData.result && Array.isArray(districtsData.result) && districtsData.result.length > 0) {
          console.log(`   ✅ Districts: SUCCESS - ${districtsData.result.length} items`);
          console.log(`   Districts:`, districtsData.result.map(district => district.name));
          results[`${lang.name} - Districts`] = { status: 'SUCCESS', count: districtsData.result.length };
        } else {
          console.log(`   ❌ Districts: FAILED - ${districtsData.result?.length || 0} items`);
          allPassed = false;
          results[`${lang.name} - Districts`] = { status: 'FAILED', count: districtsData.result?.length || 0 };
        }
      } else {
        console.log(`   ⚠️  Districts: SKIPPED - No states available`);
        results[`${lang.name} - Districts`] = { status: 'SKIPPED', count: 0 };
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      allPassed = false;
      results[`${lang.name} - Error`] = { status: 'ERROR', count: 0 };
    }
  }
  
  console.log(`\n${allPassed ? '🎉' : '❌'} Overall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  console.log('\n📊 Detailed Results:');
  Object.keys(results).forEach(key => {
    const result = results[key];
    const emoji = result.status === 'SUCCESS' ? '✅' : result.status === 'SKIPPED' ? '⚠️' : '❌';
    console.log(`   ${emoji} ${key}: ${result.status} (${result.count} items)`);
  });
  
  if (allPassed) {
    console.log('\n🎉 COMPLETE SOLUTION WORKING!');
    console.log('✅ All languages have categories, states, and districts');
    console.log('✅ Header dropdown news should now display properly');
    console.log('✅ All APIs work on Vercel exactly like locally');
    console.log('\n🚀 Your website should now display all content properly in all languages!');
  } else {
    console.log('\n❌ Some APIs are still not working. Check the logs above for details.');
  }
};

testCompleteSolution().catch(console.error);