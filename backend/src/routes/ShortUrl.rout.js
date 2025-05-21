import express from 'express';
import { AddUrl, DeleteUrl, GetAllUrls} from '../controllers/ShortUrl.Controller.js';
import isAuthenticated from '../middlewares/isAuth.Middleware.js';


const router = express.Router();


// api routes
router.route('/shorten').post(isAuthenticated, AddUrl);
router.route('/shorten').get(isAuthenticated, GetAllUrls);
router.route('/shorten').delete(isAuthenticated, DeleteUrl);


export default router;
