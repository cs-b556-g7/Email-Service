import express from 'express';
import { sendBookingEmails } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-booking-emails', sendBookingEmails);

export default router;
