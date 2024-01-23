import { ApiError } from "../exceptions/apiError.js";
import userService from "../services/userService.js";
import { validationResult } from 'express-validator';

class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { email, password } = req.body;
            const userData = await userService.register(email, password);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }
            
            const { email, password } = req.body;
            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const deletedRowsCount = await userService.logout(refreshToken);

            res.clearCookie('refreshToken')
                .json({ deletedRowsCount: deletedRowsCount });
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            await userService.activate(req.params.link);
            res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();