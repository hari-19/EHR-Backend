import express   from 'express';
import * as doctorController from '../controllers/doctorController';
import { validate } from 'express-validation';

const router = express.Router();

router.post('/signup', validate(doctorController.signUpValidation), doctorController.signUp);
router.post('/register', validate(doctorController.registerValidation), doctorController.register);
router.post('/signIn', validate(doctorController.signInValidation), doctorController.signIn);

export default router;  