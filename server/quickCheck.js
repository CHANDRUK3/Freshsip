import mongoose from 'mongoose';

// Direct connection string
const MONGO_URI = 'mongodb+srv://chandruk26062005_db_user:_Gn8qgUu6EJSF95@freshsip.vv6nn2h.mongodb.net/freshsip';

// User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        console.log('🔗 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        
        const users = await User.find().select('name email role createdAt');
        console.log(`\n📊 Total users in database: ${users.length}`);
        
        if (users.length > 0) {
            console.log('\n👥 Users found:');
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Created: ${user.createdAt.toLocaleString()}`);
                console.log('─'.repeat(40));
            });
        } else {
            console.log('\n📝 No users found in database');
            console.log('💡 Try creating a new signup at: http://localhost:5173');
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Database check complete');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
