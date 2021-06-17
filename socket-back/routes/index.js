import express from "express";
import messages from "./messages";
import users from "./users";
import groups from "./groups";

const router = express.Router();

router.use('/messages', messages);
router.use('/users', users);
router.use('/groups', groups);

export default router;
