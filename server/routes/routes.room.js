import { Router } from "express";
import { creatingRoom, joinRoom } from "../controllers/controllers.room.js";


const router = Router();

router.post("/creatingRoom", creatingRoom);
router.post("/joinRoom", joinRoom);


export default router;
