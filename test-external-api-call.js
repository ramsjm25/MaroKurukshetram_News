// Test external API call directly from Node.js
const testExternalApiCall = async () => {
  const tamilId = '46549602-7040-47a1-a717-54b780452c9b';
  const targetUrl = `https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/categories?language_id=${tamilId}`;
  
  console.log('🔍 Testing External API call from Node.js...');
  console.log(`Target URL: ${targetUrl}`);
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MaroKurukshetram-Web/1.0',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
    
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.log(`Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log(`Error Text:`, errorText);
      return;
    }
    
    const data = await response.json();
    console.log(`Response Data:`, JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.log(`Fetch Error:`, error.message);
    console.log(`Error Stack:`, error.stack);
  }
};

testExternalApiCall().catch(console.error);
