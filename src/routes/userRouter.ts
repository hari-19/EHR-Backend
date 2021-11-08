import express   from 'express';
import * as userController from '../controllers/userController';
import { validate } from 'express-validation';

const router = express.Router();

router.post('/signup', validate(userController.signUpValidation), userController.signUp);
router.post('/signIn', validate(userController.signInValidation), userController.signIn);

export default router;