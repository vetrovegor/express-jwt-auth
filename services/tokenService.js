import jwt from "jsonwebtoken";
import 'dotenv/config';
import { Token } from "../models/model.js";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId: userId } });

        if (tokenData) {
            tokenData.token = refreshToken;
            return await tokenData.save();
        }

        const token = await Token.create({ userId, token: refreshToken });

        return token;
    }

    async removeToken(refreshToken) {
        const deletedRowsCount = await Token.destroy({ where: { token: refreshToken } });

        return deletedRowsCount;
    }

    async validateAccessToken(token) {
        try {
            const userData = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            console.log(`userData: ${userData}`);

            return userData;
        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            const userData = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(token) {
        const userData = await Token.findOne({ where: { token } });

        return userData;
    }
}

export default new TokenService();