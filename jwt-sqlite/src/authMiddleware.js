import "dotenv/config";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ success: false, message: "Token is required" });

    const tokenWithoutBearer = token.split(" ")[1];

    jwt.verify(tokenWithoutBearer, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: "Invalid or expired token" });

        req.user = decoded;
        next();
    });
};

export default authMiddleware;
