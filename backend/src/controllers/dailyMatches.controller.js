import express from 'express';
import { GetDogFromRequest } from '../middlewares/dog.js';
import { DailyMatchesModel } from '../models/dailyMatches.model.js';
import { Op } from 'sequelize';


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

        const updatedCount =  await DailyMatchesModel.update({
            [isLowerDog ? 'lowerDogLiked' : 'higherDogLiked']: true
        },{
            where: {
                id: dailyMatchId
            }
        });

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
        const foundMatchesRaw = await DailyMatchesModel.findAll({
            where:{
                [Op.or] : [{lowerDogId:dog.id},{higherDogId:dog.id}]
            }
        });

        if(!foundMatchesRaw)
        {
            res.json([]);
            return;
        }

        const foundMatches = foundMatchesRaw.map((match) => {
            return match.dataValues;
        })

        res.json(foundMatches);
    } catch (e) {
        next(e);
    }
}

