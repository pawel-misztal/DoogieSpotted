import express from 'express';
import { MatchesModel } from '../models/matches.model.js';
import { Op } from 'sequelize';


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export async function getDogMatches(req, res) {
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

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
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