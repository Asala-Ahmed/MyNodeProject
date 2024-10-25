import { verifyToken } from '../helpers/tokenHelper.js'; // Adjust the path to your token service

// Middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = verifyToken(token); // Call the verifyToken function
        req.user = user; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(403).json({ message: err.message }); // Send the error message from the verification
    }
};

export default authenticate;
