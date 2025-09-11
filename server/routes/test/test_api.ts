import express from "express";
const router = express.Router();

import {
  getTempFromESP32,
  getLastestTempFromESP32,
  handlePostTempFromESP32,
  handleGetAllTemps,
} from "../../controllers/test";

export const getTempFromESP32Controller = router.get(
  "/temp-water-test",
  getTempFromESP32
);

export const getLastestTempFromESP32Controller = router.get(
  "/latest-temp",
  getLastestTempFromESP32
);

export const postTempFromESP32Controller = router.post(
  "/temp-water-test",
  handlePostTempFromESP32
);
export const getAllTempsController = router.get("/temps", handleGetAllTemps);
