import { Router } from "express";
import { HasDog } from "../middlewares/dog.js";
import {
    getDailyMatches,
    getDailyMatchPreferences,
    RateDailyMatch,
    updateDailyMatchPreferences,
} from "../controllers/dailyMatches.controller.js";

const dailyMatchesRouter = Router();

dailyMatchesRouter.get("/:dogId", HasDog, getDailyMatches);
dailyMatchesRouter.post(
    "/:dogId/:dailyMatchId/rate/:like",
    HasDog,
    RateDailyMatch
);
dailyMatchesRouter.get("/:dogId/preferences", HasDog, getDailyMatchPreferences);
dailyMatchesRouter.put(
    "/:dogId/preferences",
    HasDog,
    updateDailyMatchPreferences
);

export { dailyMatchesRouter };
