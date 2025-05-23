// eslint-disable-next-line no-unused-vars
import express from "express";
import { GetDogFromRequest } from "../middlewares/dog.js";
import { DailyMatchesModel } from "../models/dailyMatches.model.js";
import { Op } from "sequelize";
import {
    DEFAULT_SEARCH_RANGE_KM,
    DogFindPreferencesModel,
} from "../models/dogFindPreferences.mode.js";
import {
    GetExistingMatches,
    GetNotRatedDailyMatches,
    TryConvertDailyMatchToMatch,
    TryGetNewDailyMatches,
} from "../utils/dailyMatchesEngine.js";
import { TryGetUser } from "../middlewares/auth.js";
import { DateNow } from "../utils/dateUtils.js";

/**
 * @typedef RateDailyMatchReq
 * @type {object}
 * @property {number} dailyMatchId
 * @property {number} like
 */

/**
 * @param {express.Request<RateDailyMatchReq,any,any,any>} req
 * @param {express.Response} res
 * @param {function():void} next
 */
export async function RateDailyMatch(req, res, next) {
    try {
        const dog = GetDogFromRequest(req);
        const dailyMatchId = req.params.dailyMatchId;
        const like = req.params.like;

        // console.log("# dailymatch id " + dailyMatchId);

        const foundDailyMatchModel = await DailyMatchesModel.findByPk(
            dailyMatchId
        );
        // console.log("# foundDailyMatchModel ");
        // console.log(foundDailyMatchModel?.dataValues);
        if (!foundDailyMatchModel) {
            res.sendStatus(404);
            return;
        }

        // console.log("# checking expored ");
        const dailyMatch = foundDailyMatchModel.dataValues;
        const isLowerDog = dailyMatch.lowerDogId === dog.id;

        const dogLiked = isLowerDog
            ? dailyMatch.lowerDogLiked
            : dailyMatch.higherDogLiked;
        if (dogLiked != 0) {
            res.sendStatus(403);
            return;
        }

        // console.log(dailyMatch.expirationDate);
        // console.log(DateNow());
        if (dailyMatch.expirationDate < DateNow()) {
            DailyMatchesModel.destroy({
                where: {
                    id: dailyMatch.id,
                },
            });
            res.sendStatus(404);
            return;
        }

        // console.log("# notExpired ");

        const updatedCount = await DailyMatchesModel.update(
            {
                [isLowerDog ? "lowerDogLiked" : "higherDogLiked"]: like,
            },
            {
                where: {
                    id: dailyMatchId,
                },
            }
        );

        // console.log("# updated ");
        // console.log(updatedCount);

        TryConvertDailyMatchToMatch(dailyMatchId);

        if (updatedCount[0] > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function()} next
 */
export async function getDailyMatches(req, res, next) {
    try {
        const dog = GetDogFromRequest(req);
        const userId = TryGetUser(req);

        // console.log("#dog id : " + dog);
        await TryGetNewDailyMatches(dog.id, userId);

        const dailyMatches = await GetNotRatedDailyMatches(dog.id);

        res.json(dailyMatches);
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function()} next
 */
export async function getDailyMatchPreferences(req, res, next) {
    try {
        const dog = GetDogFromRequest(req);

        let foundPrefs = await DogFindPreferencesModel.findOne({
            where: {
                dogId: dog.id,
            },
        });
        if (!foundPrefs) {
            foundPrefs = await DogFindPreferencesModel.create({
                dogId: dog.id,
                distance: DEFAULT_SEARCH_RANGE_KM,
            });
        }

        res.json({
            distance: foundPrefs.dataValues.distance,
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @typedef PrefsUpdateBody
 * @type {object}
 * @property {number} distance
 */

/**
 *
 * @param {express.Request<any,any,PrefsUpdateBody,any>} req
 * @param {express.Response} res
 * @param {function()} next
 */
export async function updateDailyMatchPreferences(req, res, next) {
    try {
        const dog = GetDogFromRequest(req);
        const prefsUpdateBody = req.body;

        prefsUpdateBody.distance = Math.min(prefsUpdateBody.distance, 100);
        prefsUpdateBody.distance = Math.max(prefsUpdateBody.distance, 1);

        const updateCount = await DogFindPreferencesModel.update(
            {
                distance: prefsUpdateBody.distance,
            },
            {
                where: {
                    dogId: dog.id,
                },
            }
        );
        if (updateCount[0] === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        next(e);
    }
}
