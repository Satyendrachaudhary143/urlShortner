import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/utils/dbConnection.js';
import UserRoute from './src/routes/User.route.js';
import cookieParser from 'cookie-parser';
import ShortUrlRoute from './src/routes/ShortUrl.rout.js';
import RedirectRoute from './src/routes/Redirect.rout.js';

dotenv.config();

const app = express();

const clintURL = [
  "https://url-shortner-undc.vercel.app",
  "http://localhost:5173",
  "https://urlshortner-1-snga.onrender.com"
]

// ✅ CORS (NO TRAILING SLASH)
app.use(cors({
  origin: clintURL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.options("*", cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// routes
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/url', ShortUrlRoute);
app.use(RedirectRoute);

const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
