import mongoose from 'mongoose';
import { config } from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

config({ path: '.env' });

async function checkData() {
  try {
    console.log('� Environment check:');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'NOT FOUND');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'NOT FOUND');
    
    if (!process.env.MONGO_URI) {
      console.log('❌ MONGO_URI not found in environment');
      return;
    }
    
    console.log('�🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!');
    
    // Check products
    const products = await Product.find({});
    console.log('📊 Total products in database:', products.length);
    
    if (products.length > 0) {
      console.log('\n📋 Products found:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price}`);
      });
    } else {
      console.log('❌ No products found in database');
    }
    
    // Check users
    const userCount = await User.countDocuments();
    console.log('\n👥 Total users in database:', userCount);
    
    // Check orders
    const orderCount = await Order.countDocuments();
    console.log('📦 Total orders in database:', orderCount);
    
    // Test database write operation
    console.log('\n🧪 Testing database write operation...');
    const testProduct = new Product({
      name: 'Test Product',
      price: 1.00,
      image: 'test.jpg',
      description: 'Test product for verification'
    });
    
    const saved = await testProduct.save();
    console.log('✅ Test product saved with ID:', saved._id);
    
    // Remove test product
    await Product.findByIdAndDelete(saved._id);
    console.log('🗑️ Test product cleaned up');
    
    mongoose.connection.close();
    console.log('\n✅ Database verification complete! Your data is properly stored.');
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    process.exit(1);
  }
}

checkData();
