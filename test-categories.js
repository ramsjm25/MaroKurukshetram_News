// Test script to check API responses
const testCategoriesAPI = async () => {
  const baseUrl = 'http://localhost:8080'; // Vite dev server
  
  console.log('🧪 Testing Categories API...\n');
  
  try {
    // Test languages first
    console.log('1. Testing languages...');
    const languagesResponse = await fetch(`${baseUrl}/api?type=languages`);
    const languagesData = await languagesResponse.json();
    console.log('Languages response:', languagesData);
    
    if (languagesData.status === 1 && languagesData.result && languagesData.result.length > 0) {
      const languageId = languagesData.result[0].id;
      console.log(`\n2. Testing categories for language: ${languageId}`);
      
      // Test categories
      const categoriesResponse = await fetch(`${baseUrl}/api?type=categories&language_id=${languageId}`);
      const categoriesData = await categoriesResponse.json();
      console.log('Categories response:', categoriesData);
      
      if (categoriesData.status === 1 && categoriesData.result) {
        console.log(`\n✅ Found ${categoriesData.result.length} categories:`);
        categoriesData.result.forEach((cat, index) => {
          console.log(`  ${index + 1}. ID: ${cat.id}, Name: ${cat.name || cat.categoryName || 'No name'}, Icon: ${cat.icon || 'No icon'}`);
        });
      } else {
        console.log('❌ No categories found or API error');
      }
    } else {
      console.log('❌ No languages found or API error');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testCategoriesAPI().catch(console.error);
