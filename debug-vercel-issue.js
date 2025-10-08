// Debug script to test Vercel API issues
const debugVercelIssue = async () => {
  const baseUrl = 'https://marokurukshetram.vercel.app';
  
  console.log('🔍 Debugging Vercel API Issues...\n');
  
  // Test 1: Categories API
  console.log('1. Testing Categories API...');
  try {
    const response = await fetch(`${baseUrl}/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    if (data.status === 1 && data.result && data.result.length > 0) {
      console.log(`✅ Categories: SUCCESS - ${data.result.length} categories`);
    } else {
      console.log(`❌ Categories: FAILED - ${data.result?.length || 0} categories`);
    }
  } catch (error) {
    console.log(`❌ Categories: ERROR - ${error.message}`);
  }
  
  // Test 2: States API
  console.log('\n2. Testing States API...');
  try {
    const response = await fetch(`${baseUrl}/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    if (data.status === 1 && data.result && data.result.length > 0) {
      console.log(`✅ States: SUCCESS - ${data.result.length} states`);
    } else {
      console.log(`❌ States: FAILED - ${data.result?.length || 0} states`);
    }
  } catch (error) {
    console.log(`❌ States: ERROR - ${error.message}`);
  }
  
  // Test 3: Test API
  console.log('\n3. Testing Test API...');
  try {
    const response = await fetch(`${baseUrl}/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`❌ Test API: ERROR - ${error.message}`);
  }
  
  // Test 4: Health Check
  console.log('\n4. Testing Health Check...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`❌ Health Check: ERROR - ${error.message}`);
  }
};

debugVercelIssue().catch(console.error);
