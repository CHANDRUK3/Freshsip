import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: 'C:\\mern stack\\in\\project\\server\\.env' });

// User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function monitorDatabase() {
    try {
        console.log('🔗 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        
        // Initial count
        const initialCount = await User.countDocuments();
        console.log(`\n📊 Current users in database: ${initialCount}`);
        
        if (initialCount > 0) {
            console.log('\n👥 Current Users:');
            const users = await User.find().select('name email role createdAt');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.createdAt.toLocaleString()}`);
            });
        }
        
        console.log('\n🔄 Monitoring for new signups...');
        console.log('📱 Go to http://localhost:5173 and create a new account');
        console.log('⏱️  Checking every 3 seconds...\n');
        
        let lastCount = initialCount;
        
        // Monitor every 3 seconds
        const interval = setInterval(async () => {
            try {
                const currentCount = await User.countDocuments();
                
                if (currentCount > lastCount) {
                    console.log(`\n🎉 NEW USER DETECTED! Total users: ${lastCount} → ${currentCount}`);
                    
                    // Get the newest users
                    const newUsers = await User.find()
                        .sort({ createdAt: -1 })
                        .limit(currentCount - lastCount)
                        .select('name email role createdAt');
                    
                    newUsers.forEach((user) => {
                        console.log(`✨ NEW: ${user.name} (${user.email}) - Created: ${user.createdAt.toLocaleString()}`);
                    });
                    
                    lastCount = currentCount;
                } else {
                    process.stdout.write('⏰ Checking... ');
                    process.stdout.write(`Users: ${currentCount}\r`);
                }
            } catch (error) {
                console.error('❌ Monitoring error:', error.message);
            }
        }, 3000);
        
        // Stop monitoring after 5 minutes
        setTimeout(() => {
            clearInterval(interval);
            console.log('\n⏹️ Monitoring stopped');
            mongoose.connection.close();
            process.exit(0);
        }, 300000);
        
    } catch (error) {
        console.error('❌ Connection error:', error.message);
        process.exit(1);
    }
}

monitorDatabase();
