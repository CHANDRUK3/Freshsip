// Test Render Backend
console.log('Testing Render backend at: https://freshsip.onrender.com');

async function testRenderBackend() {
    try {
        console.log('🔍 Testing root endpoint...');
        const rootResponse = await fetch('https://freshsip.onrender.com/');
        console.log('Response status:', rootResponse.status, rootResponse.statusText);
        
        const responseText = await rootResponse.text();
        console.log('Response content (first 200 chars):', responseText.substring(0, 200));
        
        if (rootResponse.status === 200 && responseText.includes('{')) {
            const rootData = JSON.parse(responseText);
            console.log('✅ Root endpoint:', rootData);
        } else {
            console.log('❌ Backend returned HTML/error page instead of JSON');
            return;
        }

        console.log('🔍 Testing products endpoint...');
        const productsResponse = await fetch('https://freshsip.onrender.com/api/products');
        const productsData = await productsResponse.json();
        console.log(`✅ Products endpoint: Found ${productsData.products?.length || 0} products`);

        if (productsData.products && productsData.products.length > 0) {
            console.log('📦 Sample product:', {
                name: productsData.products[0].name,
                price: productsData.products[0].price,
                category: productsData.products[0].category
            });
        }

        console.log('🎉 Backend is working correctly!');
        
    } catch (error) {
        console.error('❌ Backend test failed:', error.message);
        
        // Check if it's a cold start issue
        if (error.message.includes('fetch failed') || error.message.includes('timeout')) {
            console.log('💡 This might be a cold start. Render services sleep after 15 minutes.');
            console.log('⏱️  Try again in 30-60 seconds...');
        }
    }
}

testRenderBackend();
