// Test the API_BASE configuration
import { API_BASE } from './client/src/utils/api.js';

console.log('Testing API_BASE configuration...');
console.log('Current API_BASE:', API_BASE);
console.log('Environment VITE_API_BASE:', process.env.VITE_API_BASE);

// Test a simple API call
async function testAPI() {
    try {
        console.log('Testing signup endpoint...');
        const response = await fetch(`${API_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            })
        });
        
        console.log('Response status:', response.status);
        const data = await response.text();
        console.log('Response:', data.substring(0, 100));
        
    } catch (error) {
        console.error('API test error:', error.message);
    }
}

testAPI();
