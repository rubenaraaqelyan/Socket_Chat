import MessagesController from "../controllers/MessagesController";
import express from "express";

const router = express.Router();

router.post('/', MessagesController.send);

router.get('/:groupId', MessagesController.getMessages);

export default router;
