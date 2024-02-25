import PostSchema from '../models/post.model.js';
import UserSchema from '../models/user.model.js';
import CommentSchema from '../models/comment.model.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';
import cheerio from 'cheerio'
// Function to import users
const importUsers = async (userData) => {
    let importedUserCount = 0;
    let rejectedUserCount = 0;
    for (const item of userData) {
        const existingUser = await UserSchema.findOne({ email: item.author_email.__cdata });
        if (!existingUser) {
            const newUser = new UserSchema({
                username: item.author_login.__cdata,
                firstname: item.author_first_name.__cdata,
                lastname: item.author_last_name.__cdata,
                email: item.author_email.__cdata,
                password: 'Open@123',
                role: 'Administrator',
                authod_id: item.author_id,
            });
            await newUser.save();
            importedUserCount++;
        } else {
            rejectedUserCount++;
        }
    }
    return { importedUserCount, rejectedUserCount };
};

// Function to import posts
const importPosts = async (postData) => {
    let importedPostCount = 0;
    let rejectedPostCount = 0;
    for (const item of postData) {
        const existingPost = await PostSchema.findOne({ post_id: item.post_id });
        if (!existingPost) {
            function extractFirstImgSrc(htmlData) {
                const $ = cheerio.load(htmlData);
                const firstImgSrc = $('img').first().attr('src');
                return firstImgSrc;
            }
            const newPost = new PostSchema({
                post_id: item.post_id,
                post_link: item.link,
                post_date: item.post_date.__cdata,
                title: item.title.__cdata,
                status: item.status.__cdata,
                post_name: item.post_name?.__cdata !== "" ? item.post_name?.__cdata : "(draft)",
                featured_image: extractFirstImgSrc(item['content:encoded'].__cdata),
                content: item['content:encoded'].__cdata,
                author: item['dc:creator'].__cdata,
                publishDate: item.pubDate,
                views: 0,
                category: Array.isArray(item.category) ? item.category.map((category) => category.__cdata) : [],
            });
            await newPost.save();
            importedPostCount++;
            await UserSchema.updateOne(
                { username: item['dc:creator'].__cdata },
                { $push: { post: newPost._id } }
            );
        } else {
            rejectedPostCount++;
        }
    }
    return { importedPostCount, rejectedPostCount };
};

// Function to import comments and associate them with posts
const importComments = async (commentData) => {
    let importedCommentCount = 0;
    let rejectedCommentCount = 0;
    for (const item of commentData) {
        const existingComment = await CommentSchema.findOne({ comment_id: item.comments.comment_id });
        if(!existingComment){
            const newComment = new CommentSchema({
                post_id: item.post_id,
                comment_id: item.comments.comment_id,
                comment_author: item.comments.comment_author?.__cdata,
                comment_author_email: item.comments.comment_author_email?.__cdata,
                comment_author_url: item.comments.comment_author_url,
                comment_content: item.comments.comment_content.__cdata === '' ? 'No comments' : item.comments.comment_content.__cdata,
                comment_date: item.comments.comment_date.__cdata,
            });
            await newComment.save();
            importedCommentCount++;
            await PostSchema.updateOne(
                { post_id: item.post_id },
                { $push: { comments: newComment._id } }
            );
        }else{
            rejectedCommentCount++
        }
    }
    return { importedCommentCount, rejectedCommentCount };
};

// Main import function
export const importData = async (req, res, next) => {
    logger.info('Blog data import API hit');
    try {
        const userData = req.body.rss.channel.author;
        const postData = req.body.rss.channel.item;
        const commentData = [];

        const filterPost = postData.filter((item) => item.post_type.__cdata === 'post');
        filterPost.map((item) => {
            Array.isArray(item.comment) && item.comment.map((comment) => {
                commentData.push({ post_id: item.post_id, comments: comment });
            });
        });
        // Track the status of each import
        let status = {};

        const { importedUserCount, rejectedUserCount } = await importUsers(userData);
        status.users = rejectedUserCount === 0 ? 'success' : 'failed';
        const { importedPostCount, rejectedPostCount } = await importPosts(filterPost);
        status.posts = rejectedPostCount === 0 ? 'success' : 'failed';
        const { importedCommentCount, rejectedCommentCount } = await importComments(commentData);
        status.comments = rejectedCommentCount === 0 ? 'success' : 'failed';
        logger.info('Data imported successfully', JSON.stringify({
            importedUser: importedUserCount,
            duplicateUser: rejectedUserCount,
            importedPost: importedPostCount,
            duplicatePost: rejectedPostCount,
            importedComment: importedCommentCount,
            duplicateComment: rejectedCommentCount,
        }));
        res.success(200, 'Data imported successfully', {
            importedUser: importedUserCount,
            duplicateUser: rejectedUserCount,
            importedPost: importedPostCount,
            duplicatePost: rejectedPostCount,
            importedComment: importedCommentCount,
            duplicateComment: rejectedCommentCount,
            status: status
        });
    } catch (error) {
        console.log(error);
        logger.error(error);
        if (error.message.includes('userData')) {
            logger.error('Error in userData mapping:', error);
            res.error(500, 'Users data import failed', error);
        } else if (error.message.includes('postData')) {
            logger.error('Error in postData mapping:', error);
            res.error(500, 'Posts data import failed', error);
        } else {
            logger.error('Unknown error:', error);
            res.error(500, 'Import failed', error);
        }
    }
};
