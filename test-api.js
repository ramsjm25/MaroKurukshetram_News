// Simple API test script
const testApiEndpoints = async () => {
  const baseUrl = 'http://localhost:3000'; // Change this to your Vercel URL when testing
  
  const endpoints = [
    { name: 'Languages', url: '/api?type=languages' },
    { name: 'Roles', url: '/api?type=roles' },
    { name: 'Local Mandi Categories', url: '/api/local-mandi-categories' }
  ];
  
  console.log('🧪 Testing API Endpoints...\n');
  
  // First test basic endpoints
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await fetch(`${baseUrl}${endpoint.url}`);
      const data = await response.json();
      
      console.log(`✅ ${endpoint.name}: ${response.status}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Result Type: ${Array.isArray(data.result) ? 'array' : typeof data.result}`);
      console.log(`   Result Length: ${Array.isArray(data.result) ? data.result.length : 'N/A'}`);
      
      if (data.result && Array.isArray(data.result) && data.result.length > 0) {
        console.log(`   Sample Item:`, data.result[0]);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Test language-dependent endpoints dynamically
  try {
    console.log('Testing language-dependent endpoints...');
    
    // Get languages first
    const languagesResponse = await fetch(`${baseUrl}/api?type=languages`);
    const languagesData = await languagesResponse.json();
    
    if (languagesData.status === 1 && languagesData.result && languagesData.result.length > 0) {
      const languageId = languagesData.result[0].id;
      console.log(`Using language ID: ${languageId} (${languagesData.result[0].language_name})`);
      
      // Test categories
      const categoriesResponse = await fetch(`${baseUrl}/api?type=categories&language_id=${languageId}`);
      const categoriesData = await categoriesResponse.json();
      console.log(`✅ Categories: ${categoriesResponse.status} - ${categoriesData.result?.length || 0} items`);
      
      // Test states
      const statesResponse = await fetch(`${baseUrl}/api?type=states&language_id=${languageId}`);
      const statesData = await statesResponse.json();
      console.log(`✅ States: ${statesResponse.status} - ${statesData.result?.length || 0} items`);
      
      // Test e-newspapers
      const newspapersResponse = await fetch(`${baseUrl}/api/e-newspapers?language_id=${languageId}`);
      const newspapersData = await newspapersResponse.json();
      console.log(`✅ E-newspapers: ${newspapersResponse.status} - ${newspapersData.result?.items?.length || 0} items`);
      
      // Test news filter
      const newsResponse = await fetch(`${baseUrl}/api/news/filter-advanced?language_id=${languageId}`);
      const newsData = await newsResponse.json();
      console.log(`✅ News Filter: ${newsResponse.status} - ${newsData.result?.items?.length || 0} items`);
      
    } else {
      console.log('❌ No languages available for testing dependent endpoints');
    }
  } catch (error) {
    console.log(`❌ Language-dependent testing failed: ${error.message}`);
  }
};

// Run the test
testApiEndpoints().catch(console.error);
