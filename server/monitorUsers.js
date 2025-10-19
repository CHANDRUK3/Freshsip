import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// User schema (same as in your User model)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function monitorUsers() {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        
        console.log('\n📊 Current Users in Database:');
        console.log('═'.repeat(50));
        
        const users = await User.find().select('name email role createdAt -_id');
        
        if (users.length === 0) {
            console.log('🔍 No users found in database yet');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Created: ${user.createdAt.toLocaleString()}`);
                console.log('─'.repeat(30));
            });
        }
        
        console.log(`\n📈 Total users: ${users.length}`);
        console.log('\n💡 Instructions:');
        console.log('1. Open http://localhost:5173 in your browser');
        console.log('2. Click "Sign Up" and create a new account');
        console.log('3. Run this script again to see the new user');
        
        await mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

monitorUsers();
