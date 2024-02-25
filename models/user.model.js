import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    username: { type: String, unique: true, required: true },
    firstname: { type: String, unique: true, required: true },
    lastname: { type: String, unique: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    authod_id: {type: Number, required: true },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // changed to array of comment references

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
