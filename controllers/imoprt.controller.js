// controllers/postController.js
import PostSchema from '../models/post.model.js';
import userSchema from '../models/user.model.js';
import logger from '../config/logger.js';

export const importData = async (req, res, next) => {
    try {
        const userData = req.body.rss.channel.author;
        const postData = req.body.rss.channel.item;

        let importedUserCount = 0;
        let rejectedUserCount = 0;
        let importedPostCount = 0;
        let rejectedPostCount = 0;

        const importData = async (dataArray, model, duplicateField, userImport = false) => {
            await Promise.all(
                dataArray.map(async (item, index) => {
                    const existingData = await model.findOne({ [duplicateField]: userImport ? item.author_email.__cdata : item.title.__cdata });

                    if (!existingData) {
                        const newData = new model({
                            ...(userImport
                                ? {
                                    username: item.author_login.__cdata,
                                    firstname: item.author_login.__cdata,
                                    lastname: item.author_login.__cdata,
                                    email: item.author_email.__cdata,
                                    password: 'Open@123',
                                    role: 'Administrator',
                                    authod_id: index + 1,
                                }
                                : {
                                    title: item.title.__cdata,
                                    content: item['content:encoded'].__cdata,
                                    author: item['dc:creator'].__cdata,
                                    publishDate: item.pubDate,
                                    category: Array.isArray(item.category) ? item.category.map((category) => category.__cdata) : [],
                                    post_date: item.post_date.__cdata,
                                    post_name: item.post_name?.__cdata,
                                    comments: Array.isArray(item.comment)
                                        ? item.comment.map((commentItem) => ({
                                            comment_author: commentItem.comment_author?.__cdata,
                                            comment_author_email: commentItem.comment_author_email?.__cdata,
                                            comment_author_url: commentItem.comment_author_url,
                                            comment_content: commentItem.comment_content?.__cdata,
                                            comment_date: commentItem.comment_date.__cdata,
                                        }))
                                        : [],
                                }),
                        });
                        await newData.save();

                        if (userImport) {
                            importedUserCount++;
                        } else {
                            importedPostCount++;
                        }
                    } else {
                        userImport ? rejectedUserCount++ : rejectedPostCount++;
                    }
                })
            );
        };

        await importData(userData, userSchema, 'email', true);
        await importData(postData.filter((item) => item.post_type.__cdata === 'post'), PostSchema, 'title');

        res.apiRespond(200, 'Data imported successfully', {
            importedUser: importedUserCount,
            duplicateUser: rejectedUserCount,
            importedPost: importedPostCount,
            duplicatePost: rejectedPostCount,
        });
    } catch (error) {
        logger.error(error);
        if (error.message.includes('userData')) {
            // Handle error from userData mapping
            logger.error('Error in userData mapping:', error);
            res.apiError(500, 'Users data import failed', error);
        } else if (error.message.includes('postData')) {
            // Handle error from postData mapping
            logger.error('Error in postData mapping:', error);
            res.apiError(500, 'Posts data import failed', error);
        } else {
            // Handle other errors
            logger.error('Unknown error:', error);
            res.apiError(500, 'Import failed', error);
        }
    }
};

