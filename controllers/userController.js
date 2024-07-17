const User = require('../models/user');
const bcrypt = require('bcrypt');
const mailChecker = require('mailchecker');
const jwt = require('jsonwebtoken');

const user_login_get = (req, res) => {
    const errorMessage = req.errorMessage; // Replace req.errorMessage with the actual variable containing the error message
    res.render('noaccess/login', { title: 'Signup', errorMessage });
};

const user_login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ Email: email });
        if (!user) {
            return res.render('noaccess/login', { title: 'Login', errorMessage: "Email is not registered" });
        }

        const passwordCheck = await bcrypt.compare(password, user.Password);
        if (!passwordCheck) {
            return res.render('noaccess/login', { title: 'Login', errorMessage: "Password is incorrect" });
        }

        // Login successful
        req.session.user = user; // Store user in session
        generateToken(user, 200, res);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

const generateToken = async (user, statusCode, res) => {
  const token = await user.jwtGenerateToken();
  console.log('Generated Token:', token); // Add this line for debugging

  // Parse expiration time from environment variable and convert to milliseconds
  const expireToken = parseInt(process.env.EXPIRE_TOKEN) * 1000 || 3600 * 1000; // Default expiry time in milliseconds

  const options = {
      httpOnly: true,
      expires: new Date(Date.now() + expireToken) // Convert seconds to milliseconds
  };

  res
      .status(statusCode)
      .cookie('token', token, options)
      .redirect('/posts');
};

const user_signup_get = (req, res) => {
    const errorMessage = req.errorMessage; // Replace req.errorMessage with the actual variable containing the error message
    res.render('noaccess/signup', { title: 'Signup', errorMessage });
};

const user_signup_post = async (req, res) => {
    const { firstName, lastName, Email, Password, confirmPassword } = req.body;
    var validSignup = true;
    const emailValid = mailChecker.isValid(Email);
    if (!emailValid) {
        console.log("email is not valid");
        return res.render('noaccess/signup', { title: 'Signup', errorMessage: "Email is not valid" });
    }

    const user = await User.findOne({ Email });
    if (user) {
        console.log("Email already in use");
        return res.render('noaccess/signup', { title: 'Signup', errorMessage: "Email is already registered. Try a new email" });
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const passwordValid = passwordPattern.test(Password);
    if (!passwordValid) {
        console.log("password is not valid. Must contain at least 1 capital letter, 1 number and be at least 8 characters");
        return res.render('noaccess/signup', { title: 'Signup', errorMessage: "Password is not valid. Must contain at least 1 capital letter, 1 number and be at least 8 characters" });
    }

    if (Password != confirmPassword) {
        console.log("passwords don't match");
        return res.render('noaccess/signup', { title: 'Signup', errorMessage: "Passwords don't match" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new User({ firstName, lastName, Email, Password: hashedPassword });
    newUser.save()
        .then((result) => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log(err);
        });
};

const user_myAccount_get = (req, res) => {
    const user = req.user; // Get the authenticated user from the middleware
    if (user) {
        res.render('access/myAccount', { title: 'myAccount', user });
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    user_login_get,
    user_login_post,
    user_signup_get,
    user_signup_post,
    user_myAccount_get
};
