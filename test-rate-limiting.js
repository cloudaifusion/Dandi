// Test script for rate limiting functionality
// Run this with: node test-rate-limiting.js

const API_BASE_URL = 'http://localhost:3000'; // Update this to your local server URL
const TEST_API_KEY = 'sk-test-key-12345678901234567890123456789012'; // Replace with a real API key

async function testRateLimiting() {
  console.log('🧪 Testing Rate Limiting Functionality...\n');

  try {
    // Test 1: Make a request to check current usage
    console.log('📊 Test 1: Checking current API key usage...');
    const response1 = await fetch(`${API_BASE_URL}/api/github-summarizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TEST_API_KEY
      },
      body: JSON.stringify({
        githubUrl: 'https://github.com/facebook/react'
      })
    });

    const result1 = await response1.json();
    console.log(`Status: ${response1.status}`);
    console.log(`Response:`, result1);
    console.log(`Current Usage: ${result1.usage || 'N/A'}`);
    console.log(`Rate Limit: ${result1.limit || 'N/A'}\n`);

    // Test 2: Make multiple requests to test rate limiting
    console.log('🚀 Test 2: Making multiple requests to test rate limiting...');
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        fetch(`${API_BASE_URL}/api/github-summarizer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': TEST_API_KEY
          },
          body: JSON.stringify({
            githubUrl: 'https://github.com/facebook/react'
          })
        }).then(async (res) => {
          const data = await res.json();
          return { status: res.status, data };
        })
      );
    }

    const results = await Promise.all(promises);
    results.forEach((result, index) => {
      console.log(`Request ${index + 1}: Status ${result.status} - ${result.data.success ? 'Success' : result.data.error}`);
      if (result.data.usage) {
        console.log(`  Usage: ${result.data.usage}/${result.data.limit}`);
      }
    });

    // Test 3: Check if rate limit is exceeded
    console.log('\n🔍 Test 3: Checking for rate limit exceeded...');
    const finalResponse = await fetch(`${API_BASE_URL}/api/github-summarizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TEST_API_KEY
      },
      body: JSON.stringify({
        githubUrl: 'https://github.com/facebook/react'
      })
    });

    const finalResult = await finalResponse.json();
    console.log(`Final Status: ${finalResponse.status}`);
    console.log(`Final Response:`, finalResult);

    if (finalResponse.status === 429) {
      console.log('✅ Rate limiting is working correctly!');
    } else {
      console.log('⚠️  Rate limiting may not be working as expected.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Instructions for running the test
console.log('📋 Instructions:');
console.log('1. Make sure your Next.js server is running on localhost:3000');
console.log('2. Update the TEST_API_KEY constant with a real API key from your database');
console.log('3. Run this script with: node test-rate-limiting.js');
console.log('4. Check the database to see if usage is being incremented correctly\n');

// Uncomment the line below to run the test
// testRateLimiting(); 