// Debug Tamil API specifically
const debugTamilApi = async () => {
  const tamilId = '46549602-7040-47a1-a717-54b780452c9b';
  
  console.log('🔍 Debugging Tamil API...\n');
  
  // Test external API directly
  console.log('1. Testing External API directly:');
  try {
    const externalResponse = await fetch(`https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/categories?language_id=${tamilId}`);
    const externalData = await externalResponse.json();
    console.log(`   Status: ${externalResponse.status}`);
    console.log(`   Data:`, JSON.stringify(externalData, null, 2));
  } catch (error) {
    console.log(`   Error:`, error.message);
  }
  
  console.log('\n2. Testing Vercel API:');
  try {
    const vercelResponse = await fetch(`https://marokurukshetram.vercel.app/api?type=categories&language_id=${tamilId}`);
    const vercelData = await vercelResponse.json();
    console.log(`   Status: ${vercelResponse.status}`);
    console.log(`   Data:`, JSON.stringify(vercelData, null, 2));
  } catch (error) {
    console.log(`   Error:`, error.message);
  }
  
  console.log('\n3. Testing with different approach - direct URL:');
  try {
    const directResponse = await fetch(`https://marokurukshetram.vercel.app/api/news/categories?language_id=${tamilId}`);
    const directData = await directResponse.json();
    console.log(`   Status: ${directResponse.status}`);
    console.log(`   Data:`, JSON.stringify(directData, null, 2));
  } catch (error) {
    console.log(`   Error:`, error.message);
  }
};

debugTamilApi().catch(console.error);
