import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    firstname: { type: String, unique: true, required: true },
    lastname: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    // posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
