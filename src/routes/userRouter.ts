import express   from 'express';
import * as userController from '../controllers/userController';
import { validate } from 'express-validation';

const router = express.Router();

router.post('/signup', validate(userController.signUpValidation), userController.signUp);

export default router;