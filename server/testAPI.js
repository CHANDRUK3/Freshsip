async function testAPI() {
  try {
    console.log('Testing API endpoint...');
    const response = await fetch('http://localhost:5000/api/products');
    
    if (!response.ok) {
      console.log(`Error: HTTP ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    console.log(`Success: Found ${data.products?.length || 0} products`);
    if (data.products && data.products.length > 0) {
      console.log('First product:', data.products[0].name);
      console.log('Sample product data:', {
        id: data.products[0]._id,
        name: data.products[0].name,
        price: data.products[0].price,
        category: data.products[0].category
      });
    }
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

testAPI();
