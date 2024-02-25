import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
    post_id: { type: Number },
    comment_parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
    comment_id: { type: Number, required: true },
    comment_author: { type: String, required: true },
    comment_author_email: { type: String },
    comment_author_url: { type: String },
    comment_content: { type: String, required: true },
    comment_date: { type: Date, default: Date.now }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
