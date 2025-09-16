const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    const { username, password, email, fullName: { firstName, lastName } } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        password: hashedPassword,
        email,
        fullName: { firstName, lastName }
    });

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            address: user.address
        },
        token
    });

}

module.exports = {
    registerUser
};