// const path = require('path');
// const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
// const { v4: uuidv4 } = require('uuid');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const secretKey = 'vG7yL*4s&uVxwRmd@M!z9^Tj0Q$e6H5';

// const usersFilePath = path.join(__dirname, '../data/users.json');
// const adminFilePath = path.join(__dirname, '../data/admin.json');

// const registerUser = async (userData) => {
//   try {
//     console.log('Registering user:', userData);
//     const { username, email, password, bio = '' } = userData; // Default bio to an empty string if not provided

//     // Read the users data
//     const users = await readJSONFile(usersFilePath);

//     // Check for existing email and username
//     if (users.find(user => user.email === email)) {
//       throw new Error('Email already exists');
//     }
//     if (users.find(user => user.username === username)) {
//       throw new Error('Username already exists');
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user object
//     const newUser = {
//       id: uuidv4(),
//       username,
//       email,
//       password: hashedPassword,
//       bio, // Add bio to the user object
//       followers: [],
//       following: []
//     };

//     // Add the new user to the users array
//     users.push(newUser);

//     // Write updated users data to the file
//     await writeJSONFile(usersFilePath, users);

//     return { message: 'User registered successfully', user: newUser };
//   } catch (error) {
//     console.error('Error registering user:', error);
//     throw new Error('User registration failed');
//   }
// };

// const loginUser = async (email, password) => {
//   try {
//     // Read the users data
//     const users = await readJSONFile(usersFilePath);

//     // Find the user by email
//     const user = users.find(u => u.email === email);
//     if (!user) {
//       throw new Error('Invalid credentials or email');
//     }

//     // Compare the provided password with the stored hash
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new Error('Invalid credentials');
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, isAdmin: user.isAdmin },
//       secretKey,
//       { expiresIn: '1h' }
//     );

//     return { user, token };
//   } catch (error) {
//     console.error('Error logging in user:', error);
//     throw new Error('Login failed');
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser
// };
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = 'vG7yL*4s&uVxwRmd@M!z9^Tj0Q$e6H5';

// Register user
const registerUser = async (userData) => {
  try {
    const { username, email, password, bio = '', profilePic = null } = userData;

    // Check for existing email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('Email or username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      bio,
      profilePic,
      followers: [],  // Initialize empty followers array
      following: []   // Initialize empty following array
    });

    return {
      message: 'User registered successfully',
      user: newUser.toJSON() // Ensure the response matches the desired format
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('User registration failed');
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secretKey,
      { expiresIn: '1h' }
    );

    return { user, token };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Login failed');
  }
};

module.exports = {
  registerUser,
  loginUser
};
