import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import User from "../models/User.js"; // Import the User model
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from '../helpers/tokenHelper.js';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        console.log("i got into here");
        const users = await User.find({}); // Fetch all users from the User collection
        console.log(users); // Log the fetched users

        if (users.length === 0) {
            console.log("No users found");
            return res.status(404).json({ msg: "No users found" });
        }

        res.status(200).json(users); // Return the list of users as JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Send response
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate tokens using the token service
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            message: "Signin successful",
            access_token: accessToken,
            refresh_token: refreshToken
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;