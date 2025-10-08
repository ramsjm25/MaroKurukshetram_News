// Test language-specific APIs
const testLanguageSpecific = async () => {
  const baseUrl = 'https://marokurukshetram.vercel.app';
  
  console.log('🌍 Testing Language-Specific APIs...\n');
  
  const languages = [
    { id: '5dd95034-d533-4b09-8687-cd2ed3682ab6', name: 'English' },
    { id: '46549602-7040-47a1-a717-54b780452c9b', name: 'Tamil (தமிழ்)' },
    { id: '8790bfb1-e207-4595-9453-f9c8d7387bbf', name: 'Kannada (ಕನ್ನಡ)' },
    { id: '90255d91-aead-47c9-ba76-ea85e75dc68b', name: 'Telugu (తెలుగు)' },
    { id: 'bde74321-ee95-42c6-b7ed-de865b65968d', name: 'Hindi (हिंदी)' }
  ];
  
  for (const lang of languages) {
    console.log(`\n📋 Testing ${lang.name} (${lang.id})...`);
    
    try {
      const response = await fetch(`${baseUrl}/api?type=categories&language_id=${lang.id}`);
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   API Status: ${data.status}`);
      console.log(`   Result Length: ${Array.isArray(data.result) ? data.result.length : 'N/A'}`);
      
      if (data.status === 1 && data.result && Array.isArray(data.result) && data.result.length > 0) {
        console.log(`   ✅ SUCCESS: ${data.result.length} categories`);
        console.log(`   Categories:`, data.result.map(cat => cat.category_name));
      } else {
        console.log(`   ❌ FAILED: ${data.result?.length || 0} categories`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Testing External API directly...');
  
  for (const lang of languages) {
    console.log(`\n📋 External API for ${lang.name}...`);
    
    try {
      const response = await fetch(`https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/categories?language_id=${lang.id}`);
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   API Status: ${data.status}`);
      console.log(`   Result Length: ${Array.isArray(data.result) ? data.result.length : 'N/A'}`);
      
      if (data.status === 1 && data.result && Array.isArray(data.result) && data.result.length > 0) {
        console.log(`   ✅ SUCCESS: ${data.result.length} categories`);
        console.log(`   Categories:`, data.result.map(cat => cat.category_name));
      } else {
        console.log(`   ❌ FAILED: ${data.result?.length || 0} categories`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
};

testLanguageSpecific().catch(console.error);
