import express   from 'express';
import * as notificationController from '../controllers/notificationController';
import { validate } from 'express-validation';

const router = express.Router();

router.post('/postRequest', validate(notificationController.postNotificationValidation), notificationController.postRequest);
router.post('/getRequest', validate(notificationController.getNotificationValidation), notificationController.getRequest);


export default router;