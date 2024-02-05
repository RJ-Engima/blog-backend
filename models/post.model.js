// models/postModel.js
import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, required: true},
    // views: { type: Number, default: 0 },
    // trendingScore: { type: Number, default: 0 },
    publishDate: { type: String, default: Date.now },
    post_date:{ type: Date, default: Date.now },
    post_name: { type: String },
    category: { type: Array },
    comments: [{
        comment_author: { type: String, required: true },
        comment_author_email: { type: String },
        comment_author_url: { type: String },
        comment_content: { type: String },
        comment_date: { type: Date, default: Date.now }
    }],
}, {timestamps:true});

// Function to calculate trending score
postSchema.methods.calculateTrendingScore = function () {
    // For simplicity, let's assume trending score is based on views only
    this.trendingScore = this.views * 0.8;
    return this.trendingScore;
};

const Post = mongoose.model('Post', postSchema);

export default Post;
