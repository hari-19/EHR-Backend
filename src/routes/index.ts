import express   from 'express';

import { helloWorldController }  from '../controllers/helloWord';

const router = express.Router();
/* GET home page. */
router.get('/', helloWorldController);

export default router;