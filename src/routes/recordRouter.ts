import express   from 'express';
import { validate } from 'express-validation';
import * as recordController from "../controllers/recordController";

const router = express.Router();

router.post('/addRecord', validate(recordController.addRecordValidation), recordController.addRecord);

export default router;