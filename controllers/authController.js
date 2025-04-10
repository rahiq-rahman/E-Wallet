const bcrypt = require('bcrypt');
const Joi = require('joi');
const { findByUsername, createUser } = require('../models/userModel');


// Joi schema for signup validation
const signupSchema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(255).required(),
    phone_no: Joi.string().min(10).max(15).required(),
    nid: Joi.string().max(20).required()
});

// Joi schema for login validation
const loginSchema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(255).required()
});

const signup = async (req, res) => {
    const { username, email, password, phone_no, nid } = req.body;

    // Validate input using Joi
    const {error} = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    // Redirect back to signup with a query parameter
       // return res.redirect(`/signup?error=${encodeURIComponent(error.details[0].message)}`);
    }

    try {
        const existingUser = await findByUsername(username);
        if (existingUser) {
           return res.status(409).json({ message: 'Username already exists' });
            // return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(username, email, hashedPassword, phone_no, nid);
        req.session.userId = userId; // Set session after signup
        // res.redirect('/home'); // Redirect to home after signup
       res.status(201).json({ message: 'User created successfully', userId });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
           return res.status(409).json({ message: 'Email or NID already exists' });
           //  return res.redirect('/signup');
        }
        res.status(500).json({ message: 'Server error' });
    }

};

const login = async (req, res) => {
    const { username, password } = req.body;

    // Validate input using Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
       return res.status(400).json({ message: error.details[0].message });
        // return res.redirect('/login');
    }

    try {
        const user = await findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
            // return res.redirect('/login');
        }

        req.session.userId = user.user_id;
        res.status(200).json({ message: 'Login successful' });
        // return res.redirect('/home'); // Redirect to home after login
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
        // return res.redirect('/login');
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
       res.status(200).json({ message: 'Logout successful' });
        // return res.redirect('/login');
    });
};

module.exports = { signup, login, logout };

