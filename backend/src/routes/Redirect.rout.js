import express from 'express';
import { RedirectUrl } from '../controllers/ShortUrl.Controller.js';


const router = express.Router();

router.route("/:shortUrl").get(RedirectUrl);


export default router;