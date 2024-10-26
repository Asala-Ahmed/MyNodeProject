import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import client from "./redisClient.js";

// Load environment variables from .env file
dotenv.config();

const generateAccessToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET);
    client.set(token, "active", "EX", 900); // Setting an expiration of 15 minutes

    return token;
};

const generateRefreshToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET);
    client.set(token, "active", "EX", 604800); // Setting an expiration of 7 days

    return token;
};

const revokeToken = (token) => {
    client.del(token, (err, reply) => {
        if (err) {
            console.error("Error revoking token:", err);
        } else {
            console.log("Token revoked:", reply);
        }
    });
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyToken, revokeToken };
