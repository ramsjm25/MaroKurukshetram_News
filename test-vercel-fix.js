// Test script to verify the Vercel API fix
const testVercelAPIs = async () => {
  const baseUrl = 'http://localhost:3000'; // Vercel dev server
  
  console.log('🧪 Testing Vercel API Fix...\n');
  
  try {
    // Test languages
    console.log('1. Testing languages...');
    const languagesResponse = await fetch(`${baseUrl}/api?type=languages`);
    const languagesData = await languagesResponse.json();
    console.log(`✅ Languages: ${languagesData.status === 1 ? 'SUCCESS' : 'FAILED'} - ${languagesData.result?.length || 0} items`);
    
    if (languagesData.status === 1 && languagesData.result && languagesData.result.length > 0) {
      const languageId = languagesData.result[0].id;
      console.log(`   Using language ID: ${languageId}`);
      
      // Test categories
      console.log('\n2. Testing categories...');
      const categoriesResponse = await fetch(`${baseUrl}/api?type=categories&language_id=${languageId}`);
      const categoriesData = await categoriesResponse.json();
      console.log(`✅ Categories: ${categoriesData.status === 1 ? 'SUCCESS' : 'FAILED'} - ${categoriesData.result?.length || 0} items`);
      
      if (categoriesData.result && categoriesData.result.length > 0) {
        console.log('   Active categories found:');
        categoriesData.result.forEach((cat, index) => {
          console.log(`     ${index + 1}. ${cat.category_name} (Active: ${cat.is_active}, Deleted: ${cat.is_deleted})`);
        });
      }
      
      // Test states
      console.log('\n3. Testing states...');
      const statesResponse = await fetch(`${baseUrl}/api?type=states&language_id=${languageId}`);
      const statesData = await statesResponse.json();
      console.log(`✅ States: ${statesData.status === 1 ? 'SUCCESS' : 'FAILED'} - ${statesData.result?.length || 0} items`);
      
      if (statesData.result && statesData.result.length > 0) {
        const stateId = statesData.result[0].id;
        console.log(`   Using state ID: ${stateId}`);
        
        // Test districts
        console.log('\n4. Testing districts...');
        const districtsResponse = await fetch(`${baseUrl}/api?type=districts&language_id=${languageId}&state_id=${stateId}`);
        const districtsData = await districtsResponse.json();
        console.log(`✅ Districts: ${districtsData.status === 1 ? 'SUCCESS' : 'FAILED'} - ${districtsData.result?.length || 0} items`);
      }
      
      // Test news filter
      console.log('\n5. Testing news filter...');
      const newsResponse = await fetch(`${baseUrl}/api/news/filter-advanced?language_id=${languageId}&limit=5`);
      const newsData = await newsResponse.json();
      console.log(`✅ News Filter: ${newsResponse.status === 200 ? 'SUCCESS' : 'FAILED'} - ${newsData.result?.items?.length || 0} items`);
      
    } else {
      console.log('❌ No languages available for testing');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testVercelAPIs().catch(console.error);
