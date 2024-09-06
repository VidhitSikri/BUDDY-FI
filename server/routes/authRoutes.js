const express = require('express');
const { register, login, submitHobbies, showUsers, updateLocation, getUserFromStore } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    check('age', 'Age is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
  ],
  register
);

router.post('/login', login);
router.post('/submit-answers', submitHobbies);
router.get('/show-users', showUsers);
router.post('/update-location', updateLocation);
router.get('/user/:userId', getUserFromStore); // New route to get user details from store

module.exports = router;
