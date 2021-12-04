import express   from 'express';

// import { helloWorldController }  from '../controllers/helloWord';
import * as ethController from '../controllers/ethController';
// import * as encryptionController from '../controllers/encryptionController';

import { RecordModel } from "../schemas/record";

import { authenticateJWT } from '../services/authService';

const router = express.Router();
/* GET home page. */
// router.get('/', helloWorldController);

// router.get('/eth', ethController.createAccount);
// router.get('/eth1', ethController.sendTransaction);
// router.get('/eth/getRecord', ethController.getRecord);
// router.post('/eth/postRecord', ethController.postRecord);
router.get('/eth/getFunds', ethController.getFunds);
router.get('/eth/getBalance', ethController.getBalance);
router.get('/eth/createAccount', ethController.createAccount);
// router.post('/enc', encryptionController.encrypt);
// router.post('/decry', encryptionController.decrypt);
// router.post('/enc1', encryptionController.aEncrypt);
// router.post('/decry1', encryptionController.aDecrypt);
// router.get('/key', encryptionController.genKey);
router.get('/temp', authenticateJWT, async (req: any, res: any, next: any) => {
    try {
        await RecordModel.create({
            data: {
                hi: "Hello"
            }
        })
        res.end();
    }
    catch(error) {
        next(error)
    }
})

export default router;