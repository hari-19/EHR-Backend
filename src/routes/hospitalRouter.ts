import express   from 'express';
import * as hospitalController from '../controllers/hospitalController';
import { validate } from 'express-validation';

const router = express.Router();

router.post('/add', validate(hospitalController.addHospitalValidation), hospitalController.addHospital);
router.get('/getAll', hospitalController.getHospitals);
router.post('/get', validate(hospitalController.getOneHospitalValidation),hospitalController.getOneHospital);

export default router;