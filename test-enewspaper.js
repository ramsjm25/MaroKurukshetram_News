// Test e-newspaper functionality
import axios from 'axios';

const API_BASE_URL = 'https://marokurukshetram.vercel.app/api'; // Your Vercel deployed API

async function testENewspaper() {
    console.log('📰 Testing E-Newspaper Functionality...\n');

    try {
        // Test 1: Check if e-newspaper endpoint is accessible without authentication
        console.log('🔍 Test 1: Checking e-newspaper endpoint accessibility...');
        
        const response = await axios.get(`${API_BASE_URL}?type=e-newspapers`, {
            params: {
                page: 1,
                limit: 10,
                language_id: '5dd95034-d533-4b09-8687-cd2ed3682ab6', // English
                dateFrom: '2024-01-01',
                dateTo: '2024-12-31',
                type: 'paper'
            },
            timeout: 10000
        });

        console.log('✅ E-newspaper endpoint accessible without authentication');
        console.log(`📊 Response status: ${response.status}`);
        console.log(`📊 Response data status: ${response.data.status}`);
        console.log(`📊 Number of newspapers: ${response.data.result?.items?.length || 0}`);

        if (response.data.result?.items && response.data.result.items.length > 0) {
            console.log('\n📰 Sample newspapers found:');
            response.data.result.items.slice(0, 3).forEach((newspaper, index) => {
                console.log(`  ${index + 1}. Date: ${newspaper.date}`);
                console.log(`     PDF URL: ${newspaper.pdfUrl || 'N/A'}`);
                console.log(`     PDF Path: ${newspaper.pdfPath || 'N/A'}`);
                console.log(`     Language: ${newspaper.language?.languageName || 'N/A'}`);
                console.log('');
            });
        } else {
            console.log('⚠️  No newspapers found in the response');
        }

        // Test 2: Check different language
        console.log('🔍 Test 2: Testing with Telugu language...');
        
        const teluguResponse = await axios.get(`${API_BASE_URL}?type=e-newspapers`, {
            params: {
                page: 1,
                limit: 5,
                language_id: 'telugu-language-id', // You might need to adjust this
                dateFrom: '2024-01-01',
                dateTo: '2024-12-31',
                type: 'paper'
            },
            timeout: 10000
        });

        console.log(`📊 Telugu response status: ${teluguResponse.data.status}`);
        console.log(`📊 Telugu newspapers: ${teluguResponse.data.result?.items?.length || 0}`);

        console.log('\n🎉 E-Newspaper Tests Completed!');
        console.log('✅ E-newspapers are accessible without authentication');
        console.log('✅ The endpoint is working properly on Vercel');
        console.log('✅ Users can access newspapers without logging in');

    } catch (error) {
        console.error('❌ E-Newspaper test failed:', error.message);
        
        if (error.response) {
            console.error('📊 Response status:', error.response.status);
            console.error('📊 Response data:', error.response.data);
            
            if (error.response.status === 401) {
                console.error('🔒 ISSUE: E-newspaper endpoint requires authentication');
                console.error('💡 SOLUTION: The API client is adding JWT tokens to all requests');
                console.error('💡 FIX: Use a separate public API client for e-newspapers');
            } else if (error.response.status === 404) {
                console.error('🔍 ISSUE: E-newspaper endpoint not found');
                console.error('💡 SOLUTION: Check if the endpoint is properly configured in API handler');
            } else {
                console.error('🔧 ISSUE: Other API error');
                console.error('💡 SOLUTION: Check API handler and external API connectivity');
            }
        }
    }
}

testENewspaper();
