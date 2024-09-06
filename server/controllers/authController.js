const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Register user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, confirmPassword, age, gender } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword, age, gender });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find the user and include the password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // Remove password from response
    user.password = undefined;

    // Store user in memory (not in session or JWT)
    req.user = user;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Submit hobbies
exports.submitHobbies = async (req, res) => {
  try {
    const { email, hobbies } = req.body;

    // Validate input
    if (!email || !hobbies) {
      return res.status(400).json({ message: 'Email and hobbies are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's hobbies
    user.hobbies = hobbies;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Hobbies updated successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Show all users
exports.showUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { email, longitude, latitude } = req.body;

    if (!email || longitude == null || latitude == null) {
      return res.status(400).json({ message: 'Email, longitude, and latitude are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.location = { longitude, latitude };
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Location updated successfully',
      data: {
        location: user.location
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Find buddies based on radius, gender, age, and compatibility
// findBuddies function in authController.js
exports.findBuddies = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent in the request body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch users within 10 km radius, same gender, and age gap of 5 years
    const radius = 10; // Radius in kilometers
    const maxAgeGap = 5; // Maximum age gap in years

    // Assuming a function getUsersWithinRadius is defined to find users within the radius
    let potentialBuddies = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      gender: currentUser.gender,
      age: { $gte: currentUser.age - maxAgeGap, $lte: currentUser.age + maxAgeGap },
      location: {
        $geoWithin: {
          $centerSphere: [
            [currentUser.location.longitude, currentUser.location.latitude],
            radius / 6378.1 // Radius in radians
          ]
        }
      }
    });

    // Calculate compatibility score
    potentialBuddies = potentialBuddies.map(user => {
      const matchedHobbies = Object.keys(currentUser.hobbies).filter(hobby => user.hobbies[hobby] === currentUser.hobbies[hobby]).length;
      const totalHobbies = 7; // Total hobbies to check
      const compatibilityScore = (matchedHobbies / totalHobbies) * 100;

      return {
        email: user.email,
        compatibilityScore
      };
    });

    // Sort buddies by compatibility score
    potentialBuddies.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.status(200).json({
      status: 'success',
      data: potentialBuddies
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

