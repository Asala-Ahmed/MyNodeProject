import express from "express";
import Organization from "../models/Organization.js";
import { verifyToken } from "../helpers/tokenHelper.js"; // Assuming you have a function to verify JWT

const router = express.Router();

// Middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = verifyToken(token); // Verify the token
        req.user = user; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Create Organization Endpoint
router.post("/", authenticate, async (req, res) => {
    const { name, description } = req.body;

    try {
        const organization = new Organization({ name, description });
        await organization.save();

        // Optionally, you could add the creator as a member of the organization
        organization.members.push({ userId: req.user.userId, accessLevel: 'admin' });
        await organization.save();

        res.status(201).json({ organization_id: organization._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Read Organization Endpoint
router.get("/:organization_id", authenticate, async (req, res) => {
    const { organization_id } = req.params;

    try {
        const organization = await Organization.findById(organization_id)
            .populate("members.userId", "name email"); // Populate user info for members

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        res.status(200).json({
            organization_id: organization._id,
            name: organization.name,
            description: organization.description,
            organization_members: organization.members
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;
