import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    comment_author: { type: String, required: true },
    comment_author_email: { type: String, required: true },
    comment_author_url: { type: String },
    comment_content: { type: String },
    comment_date: { type: Date, default: Date.now }
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
