import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtService = {
    generateAccessToken(id) {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "2m" });
        return accessToken;
    },

    generateRefreshToken(id) {
        const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: "5m" });
        return refreshToken;
    },

    validateRefreshToken(refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, data) => {
            if (err) throw err;

            return data;
        });
    },
};

export default jwtService;
