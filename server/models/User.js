import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true, minlength: 6 },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	try {
		if (!this.isModified('password')) return next();
		console.log('Hashing password for user:', this.email);
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		console.log('Password hashed successfully');
		return next();
	} catch (error) {
		console.error('Password hashing error:', error);
		return next(error);
	}
});

UserSchema.methods.comparePassword = async function (candidate) {
	return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;


