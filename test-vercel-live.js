// Test script to check live Vercel deployment
const testLiveVercel = async () => {
  // You need to replace this with your actual Vercel domain
  const baseUrl = 'https://marokurukshetram-news.vercel.app'; // Replace with your actual domain
  
  console.log('🧪 Testing Live Vercel Deployment...\n');
  console.log(`Testing: ${baseUrl}\n`);
  
  const tests = [
    {
      name: 'Languages API',
      url: `${baseUrl}/api?type=languages`,
      expected: 'languages array'
    },
    {
      name: 'Categories API',
      url: `${baseUrl}/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      expected: 'categories array'
    },
    {
      name: 'States API',
      url: `${baseUrl}/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      expected: 'states array'
    },
    {
      name: 'Test API',
      url: `${baseUrl}/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      expected: 'test response'
    }
  ];
  
  for (const test of tests) {
    console.log(`Testing ${test.name}...`);
    try {
      const response = await fetch(test.url);
      const data = await response.json();
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Response:`, JSON.stringify(data, null, 2));
      
      if (response.status === 200) {
        console.log(`  ✅ ${test.name}: SUCCESS`);
      } else {
        console.log(`  ❌ ${test.name}: FAILED (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }
};

testLiveVercel().catch(console.error);
