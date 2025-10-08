// Simple API test script
const testApiEndpoints = async () => {
  const baseUrl = 'http://localhost:3000'; // Change this to your Vercel URL when testing
  
  const endpoints = [
    { name: 'Languages', url: '/api?type=languages' },
    { name: 'Categories (English)', url: '/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6' },
    { name: 'States (English)', url: '/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6' },
    { name: 'E-newspapers', url: '/api/e-newspapers?language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6' },
    { name: 'Local Mandi Categories', url: '/api/local-mandi-categories' },
    { name: 'News Filter', url: '/api/news/filter-advanced?language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6' }
  ];
  
  console.log('🧪 Testing API Endpoints...\n');
  
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
};

// Run the test
testApiEndpoints().catch(console.error);
