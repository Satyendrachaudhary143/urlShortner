import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/utils/dbConnection.js';
import UserRoute from './src/routes/User.route.js';
import cookieParser from 'cookie-parser';
import ShortUrlRoute from './src/routes/ShortUrl.rout.js';
import RedirectRoute from './src/routes/Redirect.rout.js';

const app = express();
dotenv.config({});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://shorturl-frontend.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// api routes
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/url', ShortUrlRoute);
app.use(RedirectRoute);

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});