// controllers/postController.js
import User from '../models/user.model.js';
import logger from '../config/logger.js';
import { io } from '../app.js';
import jwt from 'jsonwebtoken'

export const addUser = async (req, res) =>{
  logger.info('Add user api hit');
  const newId = await User.find()
  newId.sort((a, b) => b.authod_id - a.authod_id )
  const oldId = newId[0].authod_id
  // console.log(newId);
  const newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    authod_id: oldId+1,
    role: "Administrator",
  })
  try {
    await newUser.save()
    res.success(200, "Adding new user success", newUser)
  } catch (error) {
    logger.error(error)
    res.error(500, "Adding new user failed", error)
  }
}
export const userLogin = async (req, res) => {
  logger.info("User login API hit")
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if(!user){
      logger.error(`User Details : ${ req.body.username } Forbidden: User not found`)
      return res.success(403, "Login failed", { Forbidden: "User not found" })
    }
    const passwordMatch = await user.comparePassword(password)

    if(!passwordMatch){
      logger.info(`User Details : ${ req.body.username } Unauthorized: Incorrect password`)
      io.emit("login", req.body.username);
      return res.success(401, "Login failed", {Unauthorized:"Incorrect password"} )
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hour'
    });
    return res.success(200, "Login success", { username: username, authod_id: user.authod_id, token:token} )
  } catch (error) {
    logger.error(`Error getting users: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getAllUsers = async (req, res) => {
  logger.info("Getting user API hit")
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    logger.error(`Error getting users: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const updateUser = async (req, res) => {
  const findData = {
    username: req.body.username,
  }
  try {
    const posts = await User.find(findData);
    res.json(posts);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const updateUserPassword = async (req, res) => {
  const findData = {
    password: req.body.password,
  }
  try {
    const posts = await User.find(findData);
    res.json(posts);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
