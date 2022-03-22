import express   from 'express';
import * as patientController from '../controllers/patientController';
import { validate } from 'express-validation';

const router = express.Router();

router.post('/register', patientController.registerPatient);
router.post('/signup', validate(patientController.signUpValidation), patientController.signUp);
router.post('/signIn', validate(patientController.signInValidation), patientController.signIn);
router.post('/get', validate(patientController.getPatientDetailsValidation), patientController.getPatientDetails);
router.post('/search', validate(patientController.patientSearchValidation), patientController.patientSearch);

export default router;