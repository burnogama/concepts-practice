import express from "express";
import jwt from "jsonwebtoken";

import jwtService from "./jwtService.js";

const app = express();

const port = 3000;

let user = {
    name: "Bruno",
    email: "bruno@email.com",
    password: "abc123",
    accessToken: "",
    refreshToken: "",
};

console.log(user);

app.use(express.json());

//Teste Authorization
app.get("/", (req, res) => {
    const accessToken = req.headers["authorization"];

    if (accessToken !== user.accessToken) return res.status(403).json({ message: "Unauthorized" });

    const isValid = jwtService.verifyToken(accessToken);
    console.log(isValid);

    if (!isValid) return res.status(403).json({ message: "Unauthorized" });

    res.status(200).json({
        message: "Congratulations!",
        user,
    });
});

//POST /login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    //Check if email or password are null
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    //Check if email and password match
    if (user.password !== password || user.email !== email)
        return res.status(403).json({ message: "Incorrect email or password" });

    //Generate Keys
    const accessToken = jwtService.generateAccessToken(email);
    const refreshToken = jwtService.generateRefreshToken(email);

    //Push keys to user
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    return res.status(200).json({
        message: "Login successful",
        user,
    });
});

//POST /logout
app.post("/logout", (req, res) => {
    user.refreshToken = "";
    user.accessToken = "";
    console.log(user);

    res.json({ message: "Logout Successful" });
});

//POST /refresh
app.post("/refresh", (req, res) => {
    const { email, refreshToken } = req.body;

    //Check if token is passed
    if (!refreshToken) return res.status(401).json({ message: "Request Token is missing" });

    //Check if it is valid
    if (refreshToken !== user.refreshToken) return res.status(403).json({ error: "Unauthorized" });

    //Generate new key if token is valid
    const newAccessToken = jwtService.generateAccessToken(email);
    user.accessToken = newAccessToken;

    return res.status(200).json({ newAccessToken: newAccessToken });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
