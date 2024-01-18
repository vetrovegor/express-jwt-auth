import bcrypt from 'bcrypt';
import { v4 } from "uuid";
import { User } from "../models/model.js";
import mailService from './mailService.js';
import tokenService from './tokenService.js';
import { UserDto } from '../dto/userDto.js';
import { ApiError } from '../exceptions/apiError.js';
import { where } from 'sequelize';

class UserService {
    async register(email, password) {
        const candidate = await User.findOne({ where: { email } });

        if (candidate) {
            throw ApiError.badRequest(`Пользователь с таким email уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = v4();
        const user = await User.create({ email, password: hashPassword, activationLink });

        await mailService.sendActivationMail(email, activationLink);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw ApiError.badRequest('Пользователь с таким email не найден');
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            throw ApiError.badRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const deletedRowsCount = await tokenService.removeToken(refreshToken);

        return deletedRowsCount;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.unauthorizedError();
        }

        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async getUsers() {
        const users = await User.findAll();

        return users;
    }
}

export default new UserService();