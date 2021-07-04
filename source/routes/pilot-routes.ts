import express from "express";
import controller from "../controllers/pilot-controller";
const router = express.Router();

router.get("/getAllPilots", controller.getAllPilots);
router.post("/addPilot", controller.addPilot);
router.post("/addRace", controller.addRace);
router.post("/addLap", controller.addLap);
router.post("/getRaceResult", controller.getRaceResult);

export = router;
