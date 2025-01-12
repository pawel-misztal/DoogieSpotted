import { Op } from "sequelize";
import { DogModel } from "../models/dog.model.js";
import { DogFindPreferencesModel } from "../models/dogFindPreferences.mode.js";
import { MatchesModel } from "../models/matches.model.js";
import { DailyMatchesModel } from "../models/dailyMatches.model.js";
import { WaitMinutes } from "./promiseUtils.js";

export const MAX_DAILY_MATCHES = 4;

//sprawdzić czy nie maczuje ci twojego psa 
//zrobić liste psów które potrzebują macza 

// bierzemy psa i szukamy mu 4 losowe psy z rasą których nie ma w maczach 

/**
 * this function will run forever, so dont try 
 * @param {number} intervalTimeMin 
 */
export function EnablePeriodicOldDailyMatchDeletion(intervalTimeMin)
{
    DeleteOldDailyMatchesLoop(intervalTimeMin);
}

async function DeleteOldDailyMatchesLoop(intervalTimeMin) {
    try {
        while(true)
        {
            await WaitMinutes(intervalTimeMin);
            DeleteOldDailyMatches();
        }
    } catch (e) {
        console.log(e);
        await WaitMinutes(intervalTimeMin);
        DeleteOldDailyMatchesLoop(intervalTimeMin);
    }
}

async function DeleteOldDailyMatches() {
    const date = Date.now();

    console.log("Destroying expired daily matches");

    const destroyedDailyMatches = await DailyMatchesModel.destroy({
        where: {
            expirationDate: {
                [Op.gte]: date
            }
        }
    });

    console.log("Destroyed expired daily matches count: " + destroyedDailyMatches);
}

/**
 * Assumes that user has dog
 * @param {number} dogId 
 * @param {number} userId 
 * @returns {Promise<number|Error>}
 */
export async function NotExpiredDailyMatchesCount(dogId) {
    try {
        const dailyMatches = await DailyMatchesModel.findAll({
            where: {
                [Op.or] : [{lowerDogId:dogId}, {higherDogId:dogId}]
            }
        });
    
        const notExpiredDailyMatches = dailyMatches.map((dailyMatch) => {
            return dailyMatch.dataValues.expirationDate < Date.now();
        });
    
        return notExpiredDailyMatches.length;
    } catch (e) {
        return e;
    }
}

/**
 * this function will try to find new matches if criteria was met 
 * @param {number} dogId 
 * @param {number} userId 
 */
export async function TryGetNewDailyMatches(dogId, userId) {
    const matchesToFind = MAX_DAILY_MATCHES - await NotExpiredDailyMatchesCount(dogId);

    for(let i = 0; i < matchesToFind; i++)
    {
        await TryFindMatches(userId, dogId);
    }
}

/**
 * --- It assumes that user has this dog, so !!!make sure to validate if user has this dog!!!
 * --- Can throw Error
 * @param {number} userId 
 * @param {number} dogId
 *  array of matches id's
 */
export async function GetExistingMatches(dogId) {
    const matches = await MatchesModel.findAll({
        where: {
            [Op.or] : [{lowerDogId:dogId},{higherDogId:dogId}]
        }
    });

    const res = matches.map((match) => {
        return match.dataValues;
    });
    return res;
}

/**
 * 
 * @param {number} dailyMatchId 
 */
export async function TryConvertDailyMatchToMatch(dailyMatchId) {
    const dailyMatchRaw = await DailyMatchesModel.findByPk(dailyMatchId);

    if(!dailyMatchRaw)
        return;

    const dailyMatch = dailyMatchRaw.dataValues;

    if(!dailyMatch.lowerDogLiked || !dailyMatch.higherDogLiked) {
        return;
    }

    const destroyDailyMatchPromise = DailyMatchesModel.destroy({
        where: {
            id: dailyMatchId
        }
    });

    const createMatchPromise = MatchesModel.create({
        lowerDogId: dailyMatch.lowerDogId,
        higherDogId: dailyMatch.higherDogId
    })
}

/**
 * 
 * @param {number} dogId 
 */
export async function GetAllDailyMatches(dogId) {
    const dailyMatches = await DailyMatchesModel.findAll({
        where: {
            [Op.or] : [{lowerDogId:dogId}, {higherDogId:dogId}]
        }
    });
    return dailyMatches.map(dailyMatch => dailyMatch.dataValues);
}

/**
 * 
 * @param {number} userId
 * @param {number} dogId 
 */
export async function TryFindMatches(userId, dogId) {
    try {
        
        const prefs = await DogFindPreferencesModel.findOne({
            where: {
                dogId: dogId
            }
        }); 
        const prefferedDistanceKm = prefs.dataValues.distance;
    
        const foundDogModel = await DogModel.findByPk(dogId);
    
        if(!foundDogModel)
            return;
    
        const dogMatchesModels = await MatchesModel.findAll({
            where: {
                [Op.or] : [{lowerDogId: dogId}, {higherDogId: dogId}]
            }
        });
    
        const dogMatchesExcluder = dogMatchesModels.map((dogModel) => {
            if(dogModel.dataValues.lowerDogId === dogId)
                return dogModel.dataValues.higherDogId;
            else 
                return dogModel.dataValues.lowerDogId;
        })
    
        
    
        const dog = foundDogModel.dataValues;
    
        const xMin = dog.x - prefferedDistanceKm;
        const xMax = dog.x + prefferedDistanceKm;
        const yMin = dog.y - prefferedDistanceKm;
        const yMax = dog.y + prefferedDistanceKm;
        const zMin = dog.z - prefferedDistanceKm;
        const zMax = dog.z + prefferedDistanceKm;
        
    
        const foundDogs = await DogModel.findAll({
            where: {
                id: { [Op.notIn]: dogMatchesExcluder}, // excluding dogs that already has match with
                ownerId: { [Op.ne]: userId }, //excluding user's dogs
                x: { [Op.between] : [xMin, xMax]},
                y: { [Op.between] : [yMin, yMax]},
                z: { [Op.between] : [zMin, zMax]},
                isFemale: { [Op.ne]: dog.isFemale } //checking for other gender
            }
        });
    
        const foundDog = foundDogs.map(d => d.dataValues);
        console.log("\n\nfound dogs");
        console.log(foundDog);
        return foundDog;
    
    } catch (error) {
        console.log(error);
    }
}



//funckja która oblicza dolną i górną wysokośc, z podanej 

//dodac w db w danych psa X,Y,Z -> szukamy w pierwszej iter po boundingBox, 
