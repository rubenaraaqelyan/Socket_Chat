import express from 'express';
import multer from 'multer';
import UsersController from '../controllers/UsersController';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', UsersController.myAccount);

router.post('/register', upload.single('avatar'), UsersController.register);

router.post('/login', UsersController.login);

router.get('/list', UsersController.list);

export default router;
