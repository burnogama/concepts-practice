import express from "express";
import bcrypt from "bcrypt";
import jwtService from "./jwtService.js";

import User from "./userRepository.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

//Protected route
router.get("/", authMiddleware, (_, res) => {
    res.json({ message: "Funcionando" });
});

//POST /register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    //Hash the user password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userData = { name, email, passwordHash };

    //Create users without tokens
    const user = await User.create(userData);

    //Generate tokens
    const refreshToken = jwtService.generateRefreshToken(user.id);
    const accessToken = jwtService.generateAccessToken(user.id);

    //Update user with generated refresh token
    const result = await User.update(user.id, { refreshToken });

    res.status(200).json({ user: result, AccessToken: accessToken });
});

//POST /login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(401).json({ error: "Email is required" });

    //Check user in database
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found." });

    //Compare passwords
    bcrypt.compare(password, user.passwordHash, async (err, data) => {
        if (err) throw err;

        if (data) {
            const accessToken = jwtService.generateAccessToken(user.id);
            const refreshToken = jwtService.generateRefreshToken(user.id);

            await User.update(user.id, { refreshToken });

            res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
            });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

//POST /logout
router.post("/logout/:id", async (req, res) => {
    //Receiving id as a string. Id was the only information sent as payload
    const { id } = req.params;
    const userId = parseInt(id);

    //Update the user to remove the token,
    //In a separate table for tokens, delete the token
    await User.update(userId, { refreshToken: null });

    res.json({ success: true, message: "Logout successful" });
});

//POST /refresh
router.post("/refresh/:id", async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id);

    //Find user from req.user.id
    const user = await User.findById(userId);
    const token = user.refreshToken;

    //If token is null, return error
    if (token === null) return res.status(401).json({ message: "Token is required, login to generate a new one" });

    jwtService.validateRefreshToken(token);

    const newAccessToken = jwtService.generateAccessToken(userId);

    res.status(200).json({ accessToken: newAccessToken });
});

export default router;
