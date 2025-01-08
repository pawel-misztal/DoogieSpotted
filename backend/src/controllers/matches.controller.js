import express from 'express';
import sequelize, { Op } from 'sequelize';
import { MatchesModel } from '../models/matches.model.js';


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export async function getDogMatches(req, res, next) {
    try {
        const dogId = GetDogId(req);
    
        const matchesFound = await MatchesModel.findAll({
            where: {
                [Op.or] : [{lowerDogId: dogId},{ higherDogId: dogId}]
            }
        });
    
        if(!matchesFound)
        {
            res.json([]);
            return;
        }
    
        const matchesFiltered =  matchesFound.map((matchModel) => {
            const match = matchModel.dataValues;
            const isLower = match.lowerDogId === dogId;
            return {
                id: match.id,
                otherDog: isLower ? match.higherDogId : match.lowerDogId,
                viewed: isLower ? match.lowerDogViewed : match.higherDogViewed
            }
        });
    
        res.json(matchesFiltered);
    } catch (e) {
        next(e);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export async function markMatchVieved(req, res, next) {
    try {
        const dogId = GetDogId(req);
        const matchId = GetMatchId(req);
    
        const match = await MatchesModel.findByPk(matchId);
        
        const isLowerDog = IsLowerDog(dogId,match);
        
        await MatchesModel.update({
            [isLowerDog ? 'lowerDogViewed' : 'higherDogViewed']: true
        },{
            where: {
                id: matchId
            }
        });
        const matchData = { ...match.dataValues, [isLowerDog ? 'lowerDogViewed' : 'higherDogViewed']: true}

        if(matchData.lowerDogViewed && matchData.higherDogViewed) {
            // TODO: create new match
        }
    
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

/**
 * if there is no dog, this will throw error
 * @param {express.Request} req
 * @returns {number} dogId 
 */
function GetDogId(req) {
    if(!req.params.dogId)
        throw Error('no dogId');
    return req.params.dogId;
}

/**
 * throws error if no matchId was found
 * @param {express.Request} req
 * @returns {number} matchId 
 */
function GetMatchId(req) {
    if(!req.params.matchId)
        throw Error('no matchId');
    return req.params.matchId;
}

/**
 * throws error if there is no match
 * @param {number} dogId 
 * @param {sequelize.Model<MatchesAttr, MatchesAttr> | null} match
 * @returns {boolean} isLowerDogId 
 */
function IsLowerDog(dogId, match) {
    if(!match || match.dataValues)
        throw Error('no match data found');
    return match.dataValues.lowerDogId === dogId;
}