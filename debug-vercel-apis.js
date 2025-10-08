// Comprehensive debugging script for Vercel APIs
const debugVercelAPIs = async () => {
  // Replace with your actual Vercel domain
  const baseUrl = 'https://marokurukshetram-news.vercel.app'; // Update this with your actual domain
  
  console.log('🔍 Debugging Vercel APIs...\n');
  console.log(`Testing: ${baseUrl}\n`);
  
  const tests = [
    {
      name: 'Health Check',
      url: `${baseUrl}/api/health`,
      description: 'Basic API health check'
    },
    {
      name: 'Languages API',
      url: `${baseUrl}/api?type=languages`,
      description: 'Fetch languages'
    },
    {
      name: 'Categories API',
      url: `${baseUrl}/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      description: 'Fetch categories for English language'
    },
    {
      name: 'States API',
      url: `${baseUrl}/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      description: 'Fetch states for English language'
    },
    {
      name: 'Test API',
      url: `${baseUrl}/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      description: 'Test API endpoint'
    }
  ];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing: ${test.name}`);
    console.log(`Description: ${test.description}`);
    console.log(`URL: ${test.url}`);
    console.log(`${'='.repeat(50)}`);
    
    try {
      const startTime = Date.now();
      const response = await fetch(test.url);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()));
      console.log(`Duration: ${duration}ms`);
      
      const responseText = await response.text();
      console.log(`Response Length: ${responseText.length} characters`);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log(`Response Type: JSON`);
        console.log(`Response Data:`, JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log(`Response Type: Text`);
        console.log(`Response Text:`, responseText);
        console.log(`Parse Error:`, parseError.message);
      }
      
      if (response.status === 200) {
        console.log(`✅ ${test.name}: SUCCESS`);
      } else {
        console.log(`❌ ${test.name}: FAILED (Status: ${response.status})`);
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`Error Type: ${error.constructor.name}`);
      console.log(`Error Message: ${error.message}`);
      console.log(`Error Stack:`, error.stack);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('Debugging Complete');
  console.log(`${'='.repeat(50)}`);
};

debugVercelAPIs().catch(console.error);
