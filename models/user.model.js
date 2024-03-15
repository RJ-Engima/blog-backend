import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    username: { type: String, unique: true, required: true },
    firstname: { type: String, unique: true, required: true },
    lastname: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    authod_id: { type: Number, required: true },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // changed to array of comment references

}, { timestamps: true });

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;
