import mongoose from 'mongoose';

// Direct connection string
const MONGO_URI = 'mongodb+srv://chandruk26062005_db_user:_Gn8qgUu6EJSF95@freshsip.vv6nn2h.mongodb.net/freshsip';

// Product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageURL: { type: String, required: true },
    category: { type: String, required: true },
    size: String,
    weight: String,
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    description: String,
    ingredients: [String],
    nutritionalInfo: {
        calories: String,
        protein: String,
        carbs: String,
        sugar: String,
        vitaminC: String
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
    try {
        console.log('🔗 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        
        const products = await Product.find();
        console.log(`\n📦 Total products in database: ${products.length}`);
        
        if (products.length > 0) {
            console.log('\n🧃 Products found:');
            products.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name} - $${product.price}`);
            });
        } else {
            console.log('\n❌ No products found in Atlas database');
            console.log('💡 Products need to be seeded to Atlas database');
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Database check complete');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkProducts();
