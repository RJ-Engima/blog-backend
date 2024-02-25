import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    views: { type: Number, default: 0 },
    status: { type: String, required: true },
    content: { type: String },
    trending: {
        status: { type: Boolean, default: false },
        views: { type: Number, default: 0 }
    },
    featured_image: {type: String},
    publishDate: { type: Date, default: Date.now },
    post_id: { type: Number, unique: true },
    post_name: { type: String, required: true },
    post_link: { type: String, unique: true },
    post_date: { type: Date, required: true },
    category: [String], // changed to array of strings
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // changed to array of comment references
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
