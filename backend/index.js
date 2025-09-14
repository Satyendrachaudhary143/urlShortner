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
const allowedOrigins = [
  'https://notetaking-1-w0mg.onrender.com', // your frontend origin
  'http://localhost:5173',// optional for local dev
  'http://localhost:5000' // backend origin for testing,
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});



const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));

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