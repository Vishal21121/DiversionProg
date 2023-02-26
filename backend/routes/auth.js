const User = require("../models/User");
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Vishalisagood$oy';

const { body, validationResult } = require('express-validator');

router.post('/createuser', [
    body('name', "Username must have 5 characters").isLength({ min: 5 }),
    body('email', "Enter the valid email id").isEmail(),
    body('password', "Password must have at least 8 characters").isLength({ min: 8 })],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ type:'error', errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.status(400).json({ success, error: "error: Sorry a user with this email already exists" });
            }
            const genSalt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password, genSalt);
            user = User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }


    });

router.post('/login', [
    body('email').isEmail(),
    body('password').exists()],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                success = false;
                return res.status(400).json({ success, error: "Try to login with correct credentials" });
            }
            let passwordCompare = await bcrypt.compare(req.body.password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: "Try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }


    });

module.exports = router