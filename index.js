import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import './models/model.js';
import { router } from './routers/router.js';
import { sequelize } from './db.js';
import { errorMiddleWare } from './middlewares/errorModdlewares.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
})); 
app.use('/api', router);
// middleware для обработк ошибок должен подключаться в самом конце
app.use(errorMiddleWare);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();