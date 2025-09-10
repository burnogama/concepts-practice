import "dotenv/config";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) return res.status(403).json({ success: false, message: "Token is required" });

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: "Invalid or expired token" });

        req.user = decoded;
        next();
    });
};

export default authMiddleware;
