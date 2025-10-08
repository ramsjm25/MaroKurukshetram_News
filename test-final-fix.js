// Final test script to verify the complete fix
const testFinalFix = async () => {
  const baseUrl = 'https://marokurukshetram.vercel.app';
  
  console.log('🚀 Testing Final Fix for All APIs...\n');
  
  const tests = [
    {
      name: 'Categories API',
      url: `${baseUrl}/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      expected: 'categories'
    },
    {
      name: 'States API', 
      url: `${baseUrl}/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`,
      expected: 'states'
    },
    {
      name: 'Districts API',
      url: `${baseUrl}/api?type=districts&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6&state_id=b6be8d5c-f276-4d63-b878-6fc765180ccf`,
      expected: 'districts'
    },
    {
      name: 'Languages API',
      url: `${baseUrl}/api?type=languages`,
      expected: 'languages'
    }
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    console.log(`\n📋 Testing ${test.name}...`);
    try {
      const response = await fetch(test.url);
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   API Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Result Type: ${Array.isArray(data.result) ? 'array' : typeof data.result}`);
      console.log(`   Result Length: ${Array.isArray(data.result) ? data.result.length : 'N/A'}`);
      
      if (data.status === 1 && data.result && Array.isArray(data.result) && data.result.length > 0) {
        console.log(`   ✅ ${test.name}: SUCCESS - ${data.result.length} items`);
        
        // Show sample data
        if (test.expected === 'categories') {
          console.log(`   Sample categories:`, data.result.slice(0, 3).map(cat => cat.category_name));
        } else if (test.expected === 'states') {
          console.log(`   Sample states:`, data.result.slice(0, 3).map(state => state.state_name));
        } else if (test.expected === 'districts') {
          console.log(`   Sample districts:`, data.result.slice(0, 3).map(district => district.name));
        } else if (test.expected === 'languages') {
          console.log(`   Sample languages:`, data.result.slice(0, 3).map(lang => lang.language_name));
        }
      } else {
        console.log(`   ❌ ${test.name}: FAILED - ${data.result?.length || 0} items`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: ERROR - ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log(`\n${allPassed ? '🎉' : '❌'} Overall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n✅ All APIs are working correctly on Vercel!');
    console.log('✅ Categories, States, Districts, and Languages are all returning data!');
    console.log('✅ News sections should now load properly!');
  } else {
    console.log('\n❌ Some APIs are still not working. Check the logs above for details.');
  }
};

testFinalFix().catch(console.error);
