import { ApiError } from "../exceptions/apiError.js"
import tokenService from "../services/tokenService.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader) {
            return next(ApiError.unauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if(!accessToken) {
            return next(ApiError.unauthorizedError());
        }

        const userData = await tokenService.validateAccessToken(accessToken);

        if(!userData) {
            return next(ApiError.unauthorizedError());
        }

        req.user = userData;

        next();
    } catch (e) {
        return next(ApiError.unauthorizedError());
    }
}