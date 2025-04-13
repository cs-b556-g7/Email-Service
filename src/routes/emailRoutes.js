import express from 'express';
import { sendBookingEmails, sendCancelledEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-booking-emails', sendBookingEmails);
router.post('/send-cancelled-emails', sendCancelledEmail); 

export default router;
