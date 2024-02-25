// controllers/postController.js
import Users from '../models/user.model.js';
import logger from '../config/logger.js';

export const addUser = async (req, res) =>{
  logger.info('Add user api hit');
  const newId = await Users.find()
  newId.sort((a, b) => b.authod_id - a.authod_id )
  const oldId = newId[0].authod_id
  // console.log(newId);
  const newUser = new Users({
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
  logger.info("User login API hit...")
  try {
    const users = await Users.find({ username: req.body.username, password: req.body.password });
    if(users.length === 0 ){
      logger.error(`Users Details : ${ req.body.username }---Invalid credentials`)
      res.success(403, "Login failed", "Invalid credentials")
    }else{
      logger.info(`Users Details : ${ req.body.username }---Login success`)
      res.success(200, "Login success", "Login success")
    }
  } catch (error) {
    logger.error(`Error getting users: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getAllUsers = async (req, res) => {
  logger.info("Getting user API hit...")
  try {
    const users = await Users.find().sort({ createdAt: -1 });
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
    const posts = await Users.find(findData);
    res.json(posts);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
