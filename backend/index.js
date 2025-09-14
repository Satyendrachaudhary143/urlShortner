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
  'https://notetaking-1-w0mg.onrender.com',
  'http://localhost:5173',
  'http://localhost:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Handle preflight requests manually (if needed)
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
console.log('Method:', req.method);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});


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