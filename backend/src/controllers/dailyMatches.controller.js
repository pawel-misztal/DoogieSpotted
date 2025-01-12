// eslint-disable-next-line no-unused-vars
import express from 'express';
import { GetDogFromRequest } from '../middlewares/dog.js';
import { DailyMatchesModel } from '../models/dailyMatches.model.js';
import { Op } from 'sequelize';
import { DEFAULT_SEARCH_RANGE_KM, DogFindPreferencesModel } from '../models/dogFindPreferences.mode.js';
import { GetAllDailyMatches, GetExistingMatches, TryConvertDailyMatchToMatch, TryGetNewDailyMatches } from '../utils/dailyMatchesEngine.js';
import { TryGetUser } from '../middlewares/auth.js';


/**
 * @typedef RateDailyMatchReq
 * @type {object}
 * @property {number} dailyMatchId
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

        const foundDailyMatchModel = await DailyMatchesModel.findByPk(dailyMatchId);
        if(!foundDailyMatchModel)
        {
            res.sendStatus(404);
            return;
        }

        const dailyMatch = foundDailyMatchModel.dataValues;
        const isLowerDog = dailyMatch.lowerDogId === dog.id;
        if(dailyMatch.expirationDate > Date.now()) {
            res.sendStatus(404);
            return;
        } 

        const updatedCount =  await DailyMatchesModel.update({
            [isLowerDog ? 'lowerDogLiked' : 'higherDogLiked']: true
        },{
            where: {
                id: dailyMatchId
            }
        });

        TryConvertDailyMatchToMatch(dailyMatchId);

        if(updatedCount[0] > 0) {
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

        await TryGetNewDailyMatches(dog.id, userId);

        const dailyMatches = await GetAllDailyMatches(dog.id);

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
export async function getDailyMatchPreferences(req,res,next) {
    try {
        const dog = GetDogFromRequest(req);
    
        let foundPrefs = await DogFindPreferencesModel.findByPk(dog.id);
        if(!foundPrefs)
        {
            foundPrefs = await DogFindPreferencesModel.create({
                dogId: dog.id,
                distance: DEFAULT_SEARCH_RANGE_KM
            });
        }

        res.json({
            distance:foundPrefs.dataValues.distance
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

        const updateCount = await DogFindPreferencesModel.update({
                distance: prefsUpdateBody.distance
            },
            {where: {
                dogId: dog.id
            }});
        if(updateCount[0] === 1) {
            req.sendStatus(200);
        } else {
            req.sendStatus(400);
        }
    } catch (e) {
        next(e);
    }
}

