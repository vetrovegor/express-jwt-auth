import { ApiError } from "../exceptions/apiError.js";

export const errorMiddleWare = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    console.log(err);

    return res.status(500).json({ message: 'Непредвиденная ошибка' });
}