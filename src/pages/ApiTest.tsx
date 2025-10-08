import { useState } from 'react';
import apiClient from '@/api/apiClient';

const ApiTestPage = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult('Testing API...');
    
    try {
      const response = await apiClient.get('/news/languages');
      setResult(`✅ API Test Successful! Status: ${response.status}, Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
    } catch (error: any) {
      setResult(`❌ API Test Failed: ${error.message} (Type: ${error.type || 'Unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  const testNewsApi = async () => {
    setLoading(true);
    setResult('Testing News API...');
    
    try {
      // First get languages to get a valid language_id
      const languagesResponse = await apiClient.get('?type=languages');
      const languages = languagesResponse.data.result;
      
      if (!languages || languages.length === 0) {
        setResult('❌ No languages available for testing');
        return;
      }
      
      const languageId = languages[0].id;
      
      // Then get categories for that language
      const categoriesResponse = await apiClient.get(`?type=categories&language_id=${languageId}`);
      const categories = categoriesResponse.data.result;
      
      if (!categories || categories.length === 0) {
        setResult('❌ No categories available for testing');
        return;
      }
      
      const categoryId = categories[0].id;
      
      // Now test news API with dynamic IDs
      const response = await apiClient.get('/news/filter-multi-categories', {
        params: {
          categoryIds: categoryId,
          language_id: languageId,
          limit: 1,
          page: 1
        }
      });
      setResult(`✅ News API Test Successful! Status: ${response.status}, Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
    } catch (error: any) {
      setResult(`❌ News API Test Failed: ${error.message} (Type: ${error.type || 'Unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="space-y-4">
          <button 
            onClick={testApi} 
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded disabled:bg-gray-400 mr-4"
          >
            {loading ? 'Testing...' : 'Test Languages API'}
          </button>
          
          <button 
            onClick={testNewsApi} 
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test News API'}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
            <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-3 rounded">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;


