// const path = require('path');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
// const { v4: uuidv4 } = require('uuid');
// const adminsFilePath = path.join(__dirname, '../data/admins.json');
// const usersFilePath = path.join(__dirname, '../data/users.json');
// const postsFilePath = path.join(__dirname, '../data/posts.json');
// const campaignsFilePath = path.join(__dirname, '../data/campaigns.json');

// const SECRET_KEY = "gcr#eH45TU%BNh8$h5T!F765$7B5gh65f@&d4f";
// const JWT_SECRET = "vG7yL*4s&uVxwRmd@M!z9^Tj0Q$e6H5"; 

// // Fetch all admins
// const getAdmins = async (req, res) => {
//   try {
//     const admins = await readJSONFile(adminsFilePath);
//     res.status(200).json(admins);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch admins' });
//   }
// };

// const addAdmin = async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).json({ message: 'Unauthorized. Only admins can add other admins.' });
//   }

//   try {
//     const users = await readJSONFile(usersFilePath); 
//     if (!Array.isArray(users)) {
//       return res.status(500).json({ message: 'Data format is incorrect. Expected array of users.' });
//     }

//     const existingUser = users.find(user => user.email === email);
//     if (existingUser) {
//       return res.status(409).json({ message: 'User with this email already exists.' });
//     }

//     const existingUsername = users.find(user => user.username === username);
//     if (existingUsername) {
//       return res.status(409).json({ message: 'Username already exists.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newAdmin = {
//       id: uuidv4(),
//       username,
//       email,
//       password: hashedPassword,
//       isAdmin: true, 
//       followers: [],
//       following: [],
//       isPrivate: false, 
//     };

//     users.push(newAdmin);
//     await writeJSONFile(usersFilePath, users); 

//     return res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
//   } catch (error) {
//     console.error('Error adding admin:', error);
//     res.status(500).json({ message: 'Failed to add admin' });
//   }
// };


// // // Admin login
// // const loginAdmin = async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     const admins = await readJSONFile(adminsFilePath);

// //     const admin = admins.find(admin => admin.email === email);
// //     if (!admin) {
// //       return res.status(404).json({ message: 'Admin not found.' });
// //     }

// //     const isPasswordValid = await bcrypt.compare(password, admin.password);
// //     if (!isPasswordValid) {
// //       return res.status(401).json({ message: 'Invalid password.' });
// //     }

// //     const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

// //     res.status(200).json({ message: 'Login successful', token });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Failed to log in' });
// //   }
// // };

// // Middleware to check if the admin is authenticated
// const authenticateAdmin = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; 
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized. Token missing.' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET); 
//     req.admin = decoded; 
//     next(); 
//   } catch (err) {
//     res.status(401).json({ message: 'Unauthorized. Invalid token.' });
//   }
// };

// // Check if a user is an admin
// const checkIfAdmin = async (userId) => {
//   try {
//     const users = await readJSONFile(usersFilePath);
//     const user = users.find(user => user.id === userId);
//     return user && user.role === 'admin';
//   } catch (err) {
//     throw new Error('Failed to check if user is admin');
//   }
// };

// // Remove an admin
// const removeAdmin = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const admins = await readJSONFile(adminsFilePath);

//     const adminIndex = admins.findIndex(admin => admin.id === id);
//     if (adminIndex === -1) {
//       return res.status(404).json({ message: 'Admin not found.' });
//     }

//     admins.splice(adminIndex, 1);
//     await writeJSONFile(adminsFilePath, admins);

//     res.status(200).json({ message: 'Admin removed successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to remove admin' });
//   }
// };

// // Fetch all users (accessible only by admins)
// const getAllUsers = async (req, res) => {
//   try {
//     if (req.admin.role !== 'admin') {
//       return res.status(403).json({ message: 'Forbidden: Admin only' });
//     }

//     const users = await readJSONFile(usersFilePath); 
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch users' });
//   }
// };

// // Fetch all posts (accessible only by admins)
// const getAllPosts = async (req, res) => {
//   try {
//     if (req.admin.role !== 'admin') {
//       return res.status(403).json({ message: 'Forbidden: Admin only' });
//     }

//     const posts = await readJSONFile(postsFilePath);
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch posts' });
//   }
// };

// // Remove a post (accessible only by admins)
// const removePost = async (req, res) => {
//   const { postId } = req.params;

//   try {
//     const posts = await readJSONFile(postsFilePath);

//     const postIndex = posts.findIndex(post => post.id === postId);
//     if (postIndex === -1) {
//       return res.status(404).json({ message: 'Post not found.' });
//     }

//     posts.splice(postIndex, 1);
//     await writeJSONFile(postsFilePath, posts);

//     res.status(200).json({ message: 'Post removed successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to remove post' });
//   }
// };
// const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Fetch all users
//     const users = await readJSONFile(usersFilePath);

//     // Find the user by ID
//     const userIndex = users.findIndex(user => user.id === id);
//     if (userIndex === -1) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Remove the user from the array
//     users.splice(userIndex, 1);

//     // Save the updated list back to the file
//     await writeJSONFile(usersFilePath, users);

//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Failed to delete user' });
//   }
// };



// module.exports = {
//   getAdmins,
//   addAdmin,
//   authenticateAdmin,
//   removeAdmin,
//   getAllUsers,
//   getAllPosts,
//   removePost,
//   checkIfAdmin,
//   deleteUser
// };

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Admin = require('../models/Admin'); // Assume Admin model is defined
const User = require('../models/user');   // Assume User model is defined
const Post = require('../models/Post');   // Assume Post model is defined

const SECRET_KEY = "gcr#eH45TU%BNh8$h5T!F765$7B5gh65f@&d4f";
const JWT_SECRET = "vG7yL*4s&uVxwRmd@M!z9^Tj0Q$e6H5";

// Fetch all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
};

// Add an admin
const addAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized. Only admins can add other admins.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
      followers: [],
      following: [],
      isPrivate: false,
    });

    await newAdmin.save();

    return res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Failed to add admin' });
  }
};



// Check if a user is an admin
const checkIfAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user && user.isAdmin;
  } catch (err) {
    throw new Error('Failed to check if user is admin');
  }
};

// Remove an admin
const removeAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findOneAndDelete({ id, isAdmin: true });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Admin removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove admin' });
  }
};

// Fetch all users (accessible only by admins)
const getAllUsers = async (req, res) => {
  try {
    if (!req.admin.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admin only' });
    }

    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Fetch all posts (accessible only by admins)
const getAllPosts = async (req, res) => {
  try {
    if (!req.admin.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admin only' });
    }

    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Remove a post (accessible only by admins)
const removePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json({ message: 'Post removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove post' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getAdmins,
  addAdmin,
  removeAdmin,
  getAllUsers,
  getAllPosts,
  removePost,
  checkIfAdmin,
  deleteUser,
};
