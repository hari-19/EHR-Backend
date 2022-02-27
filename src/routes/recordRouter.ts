import express   from 'express';
import { validate } from 'express-validation';
import { authenticateJWT } from '../services/authService';
import * as recordController from "../controllers/recordController";

const router = express.Router();

router.post('/addRecord', validate(recordController.addRecordValidation), recordController.addRecord);
router.post('/getRecordIdByPatientId', validate(recordController.getPatientRecordIdsByPatientIdValidation), recordController.getPatientRecordIdsByPatientId);
router.post('/getRecordsByPatientId', validate(recordController.getRecordsByPatientIdValidation), recordController.getRecordsByPatientId);
router.post('/getRecord', validate(recordController.getRecordValidation), recordController.getRecord);
router.post('/postRecordKeys', validate(recordController.postRecordKeysValidation), recordController.postRecordKeys);

export default router;