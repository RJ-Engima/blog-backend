import path from "path";
import logger from '../config/logger.js';
import { google } from "googleapis";
import { fileURLToPath } from "url";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import PostSchema from '../models/post.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const analyticsDataClient = new BetaAnalyticsDataClient();

export const getAllPosts = async (req, res) => {
  logger.info("Fetching Post API hit")
  try {
    const posts = await PostSchema.find().sort({ post_date: -1 });
    res.json(posts);
    logger.info("Success in fetching data")
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.error(500, "Error getting posts", error);
  }
};
export const getPost = async (req, res) => {
  logger.info('Get individual post hit ')
  try {
    let query = req.query.post_name !== undefined ? { post_name: req.query.post_name, status:{ $in: "publish"} } : {}
    const post = await PostSchema.find(query).populate('comments').sort({publishDate: -1});
    res.json(post);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.error(500, "Error getting posts", error);
  }
};
export const getPostCategory = async (req, res) => {
  logger.info('get Category post hit ')
  try {
    let query = req.query.category !== undefined ? { category: { $in: req.query.category }, status:{ $in: "publish"} } : {}
    const post = await PostSchema.find(query).populate('comments').sort({publishDate: -1});
    res.json(post);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.error(500, "Error getting posts", error);
  }
};
export const getPostAuthor = async (req, res) => {
  logger.info('Get Authors post hit ')
  console.log(req.socket.remoteAddress);
  try {
    let query = req.query.author !== undefined ? { author: { $in: req.query.author }, status:{ $in: "publish"} } : {}
    const post = await PostSchema.find(query).sort({publishDate: -1});
    res.json(post);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.error(500, "Error getting posts", error);
  }
};
export const getAllCategory = async (req, res) => {
  logger.info('Get All category api hit ')
  try {
    const uniqueCategories = await PostSchema.aggregate(
      [
        {
          $unwind: '$category' // Unwind the categories array
        },
        {
          $group: {
            _id: { $toLower: '$category' } // Group by category (case-insensitive)
          }
        },
        {
          $project: {
            _id: 0,
            category: '$_id'
          }
        }
      ]
    );
    console.log(uniqueCategories.length);
    res.json(uniqueCategories.map(category => category.category));
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.error(500, "Error getting posts", error);
  }
};

export const getTrendingPosts = async (req, res) => {
  logger.info('Get Trending Posts API hit ')
  // console.log(req.params);
  try {
    const post = await PostSchema.find({ ["trending.status"]: true }).sort({ "trending.views": -1 });
    res.json(post);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.error(500, "Error getting posts", error);
  }
};
export const addPost = async (req, res) => {
  logger.info('New post APi hit ')
  const lastPost = await PostSchema.findOne().sort({ post_id: -1 })
  try {
    const newPost = new PostSchema({
      post_id: lastPost.post_id + 1,
      post_link: req.body.post_link,
      post_date: new Date(req.body.post_date).toDateString(),
      title: req.body.title,
      status: req.body.status,
      post_name: req.body.post_name,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate,
      category: Array.isArray(req.body.category) ? req.body.category.map((category) => category) : [],
    });
    // await newPost.save()
    console.log(newPost);
    res.success(200, "Success adding post");
  } catch (error) {
    logger.error(`Error adding posts: ${error.message}`);
    res.error(500, "Error adding posts", error);
  }
};