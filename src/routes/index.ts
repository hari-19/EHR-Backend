import express   from 'express';

import { helloWorldController }  from '../controllers/helloWord';
import * as ethController from '../controllers/ethController';

const router = express.Router();
/* GET home page. */
router.get('/', helloWorldController);

router.get('/eth', ethController.createAccount);
router.get('/eth1', ethController.sendTransaction);
router.get('/eth/getRecord', ethController.getRecord);
router.post('/eth/postRecord', ethController.postRecord);
router.get('/eth/getFunds', ethController.getFunds);

export default router;