import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import User from "../models/User.js"; // Import the User model

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

router.post("/add", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        console.log("i am posting")
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;