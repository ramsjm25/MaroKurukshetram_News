// Test script to verify categories fix
const testCategoriesFix = async () => {
  const baseUrl = 'http://localhost:3000'; // Vercel dev server
  
  console.log('🧪 Testing Categories Fix...\n');
  
  try {
    console.log('Testing categories API...');
    const response = await fetch(`${baseUrl}/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    if (data.status === 1 && data.result && data.result.length > 0) {
      console.log(`✅ SUCCESS: ${data.result.length} categories returned`);
      console.log('Categories:');
      data.result.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.category_name} (Active: ${cat.is_active}, Deleted: ${cat.is_deleted})`);
      });
    } else {
      console.log(`❌ FAILED: No categories returned`);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
};

testCategoriesFix().catch(console.error);
