import jwt from "jsonwebtoken";

const accessKey = "SimpleAccessKey";
const refreshKey = "AnotherSimpleKey";

const jwtService = {
    generateAccessToken(email) {
        const accessToken = jwt.sign({ email }, accessKey, { expiresIn: "2m" });
        return accessToken;
    },

    generateRefreshToken(email) {
        const refreshToken = jwt.sign(email, refreshKey);
        return refreshToken;
    },

    verifyToken(accessToken) {
        const verified = jwt.verify(accessToken, accessKey);
        return verified;
    },
};

export default jwtService;
