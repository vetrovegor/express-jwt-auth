import { Router } from "express";
import userController from "../controllers/userController.js";
import { body } from 'express-validator';
import { authMiddleware } from "../middlewares/authMiddleWare.js";

export const router = new Router();

router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.register
);

router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.login
);

router.post(
    '/logout',
    userController.logout
);

router.get(
    '/activate/:link',
    userController.activate
);

router.get(
    '/refresh',
    userController.refresh
);

router.get(
    '/users',
    authMiddleware,
    userController.getUsers
);