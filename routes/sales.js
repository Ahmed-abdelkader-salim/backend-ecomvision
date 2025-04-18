import express from "express";
const router = express.Router();

import { getOverview } from "../controllers/sales.js";


router.get("/overview", getOverview)


export default router;