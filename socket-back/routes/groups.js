import GroupsController from "../controllers/GroupsController";
import express from "express";

const router = express.Router();

router.post('/direct', GroupsController.createDirect);

export default router;
