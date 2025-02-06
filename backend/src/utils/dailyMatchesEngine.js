import { Op, Sequelize } from "sequelize";
import { DogModel } from "../models/dog.model.js";
import { DogFindPreferencesModel } from "../models/dogFindPreferences.mode.js";
import { MatchesModel } from "../models/matches.model.js";
import { DailyMatchesModel } from "../models/dailyMatches.model.js";
import { WaitMinutes } from "./promiseUtils.js";
import { DaysFromNow } from "./dateUtils.js";

export const MAX_DAILY_MATCHES = 4;

//sprawdzić czy nie maczuje ci twojego psa
//zrobić liste psów które potrzebują macza

// bierzemy psa i szukamy mu 4 losowe psy z rasą których nie ma w maczach

/**
 * this function will run forever, so dont try
 * @param {number} intervalTimeMin intervall time in mins
 */
export function EnablePeriodicOldDailyMatchDeletion(intervalTimeMin) {
    DeleteOldDailyMatchesLoop(intervalTimeMin);
}

/**
 *
 * @param {number} intervalTimeMin interval time in mins
 */
async function DeleteOldDailyMatchesLoop(intervalTimeMin) {
    try {
        while (true) {
            await WaitMinutes(intervalTimeMin);
            DeleteOldDailyMatches();
        }
    } catch (e) {
        console.log(e);
        await WaitMinutes(intervalTimeMin);
        DeleteOldDailyMatchesLoop(intervalTimeMin);
    }
}

/**
 *
 */
async function DeleteOldDailyMatches() {
    const date = Date.now();

    console.log("Destroying expired daily matches");

    const destroyedDailyMatches = await DailyMatchesModel.destroy({
        where: {
            expirationDate: {
                [Op.gte]: date,
            },
        },
    });

    console.log(
        "Destroyed expired daily matches count: " + destroyedDailyMatches
    );
}

/**
 * Assumes that user has dog
 * searching for valid daily matches(not expired)  with dog id
 * @param {number} dogId dog id
 * @returns {Promise<number|Error>} not expired daily match count or error
 */
export async function NotExpiredDailyMatchesCount(dogId) {
    try {
        const dailyMatches = await DailyMatchesModel.findAll({
            where: {
                [Op.or]: [{ lowerDogId: dogId }, { higherDogId: dogId }],
            },
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
 * one of the criteria is tha the daily match limit is not meet
 * @param {number} dogId dog id
 * @param {number} userId user id
 * @returns {Promise<import("../models/dailyMatches.model.js").DailyMatchesAtt>}
 */
export async function TryGetNewDailyMatches(dogId, userId) {
    console.log("#TryGetNewDailyMatches");
    const matchesToFind =
        MAX_DAILY_MATCHES - (await NotExpiredDailyMatchesCount(dogId));

    // console.log(matchesToFind);
    const res = await TryFindMatches(userId, dogId, matchesToFind);

    console.log("#res");
    // console.log(res);
    if (!res || res.length == 0) return;

    const matches = await Promise.all(
        res.map((dogModel) => {
            return AddDailyMatchWithDog(dogModel, dogId);
        })
    );

    console.log("#matches");
    // console.log(matches);
    const filteredMatches = matches.filter((a) => a !== null);

    console.log("#filteredMatches");
    // console.log(filteredMatches);
    return filteredMatches;
}

/**
 * --- It assumes that user has this dog, so !!!make sure to validate if user has this dog!!!
 * --- Can throw Error
 * @param {number} dogId
 *  array of matches id's
 * @returns {Promise<import("../models/matches.model.js").MatchesAttr[]>} matches model
 */
export async function GetExistingMatches(dogId) {
    const matches = await MatchesModel.findAll({
        where: {
            [Op.or]: [{ lowerDogId: dogId }, { higherDogId: dogId }],
        },
    });

    const res = matches.map((match) => {
        return match.dataValues;
    });
    return res;
}

/**
 *
 * @param {number} dailyMatchId daily match id
 */
export async function TryConvertDailyMatchToMatch(dailyMatchId) {
    const dailyMatchRaw = await DailyMatchesModel.findByPk(dailyMatchId);

    if (!dailyMatchRaw) return;

    const dailyMatch = dailyMatchRaw.dataValues;

    if (!dailyMatch.lowerDogLiked || !dailyMatch.higherDogLiked) {
        return;
    }

    const destroyDailyMatchPromise = DailyMatchesModel.destroy({
        where: {
            id: dailyMatchId,
        },
    });

    const createMatchPromise = MatchesModel.create({
        lowerDogId: dailyMatch.lowerDogId,
        higherDogId: dailyMatch.higherDogId,
    });

    await Promise.all(destroyDailyMatchPromise, createMatchPromise);
}

/**
 *
 * @param {number} dogId dog id
 * @returns {Promise<DailyMatchesAttr[]>} daily mayches model
 */
export async function GetAllDailyMatches(dogId) {
    const dailyMatches = await DailyMatchesModel.findAll({
        where: {
            [Op.or]: [{ lowerDogId: dogId }, { higherDogId: dogId }],
        },
    });
    return dailyMatches.map((dailyMatch) => dailyMatch.dataValues);
}

/**
 *
 * @param {number} dogId dog id
 * @returns {Promise<DailyMatchesAttr[]>} daily mayches model
 */
export async function GetNotRatedDailyMatches(dogId) {
    const dailyMatches = await DailyMatchesModel.findAll({
        where: {
            [Op.or]: [
                { lowerDogId: dogId, lowerDogLiked: 0 },
                { higherDogId: dogId, higherDogLiked: 0 },
            ],
        },
    });
    return dailyMatches.map((dailyMatch) => dailyMatch.dataValues);
}

/**
 *
 * @param {import("../models/dog.model.js").DogAttr} dogModel found match dog model
 * @param {number} dogId id of dog for which match was found
 * @returns {Promise<import("../models/dailyMatches.model.js").DailyMatchesAtt | null>} daily match model
 */
export async function AddDailyMatchWithDog(dogModel, dogId) {
    try {
        const dogModelHasLowerId = dogModel.id < dogId;
        const lowerDogId = dogModelHasLowerId ? dogModel.id : dogId;
        const higherDogId = dogModelHasLowerId ? dogId : dogModel.id;

        const foundMatch = await DailyMatchesModel.findOne({
            where: {
                lowerDogId,
                higherDogId,
            },
        });
        if (foundMatch) return null;

        const dailyMatch = await DailyMatchesModel.create({
            lowerDogId,
            higherDogId,
            lowerDogLiked: false,
            higherDogLiked: false,
            expirationDate: DaysFromNow(1),
        });
        if (!dailyMatch) return null;
        return dailyMatch.dataValues;
    } catch (e) {
        console.log(e);
        return null;
    }
}

/**
 *
 * @param {number} userId user id
 * @param {number} dogId dog id
 * @param {number} maxMatches max amount of matches, default is 1
 * @returns  {Promise<import("../models/dog.model.js").DogAttr[] | undefined>} dog model or undefined
 */
export async function TryFindMatches(userId, dogId, maxMatches = 1) {
    try {
        const prefs = await DogFindPreferencesModel.findOne({
            where: {
                dogId: dogId,
            },
        });
        const prefferedDistanceKm = prefs.dataValues.distance;

        const foundDogModel = await DogModel.findByPk(dogId);

        if (!foundDogModel) return;

        const dogMatchesModels = await MatchesModel.findAll({
            where: {
                [Op.or]: [{ lowerDogId: dogId }, { higherDogId: dogId }],
            },
        });

        const dogMatchesExcluder = dogMatchesModels.map((dogModel) => {
            if (dogModel.dataValues.lowerDogId === dogId)
                return dogModel.dataValues.higherDogId;
            else return dogModel.dataValues.lowerDogId;
        });

        const dog = foundDogModel.dataValues;

        const xMin = dog.x - prefferedDistanceKm;
        const xMax = dog.x + prefferedDistanceKm;
        const yMin = dog.y - prefferedDistanceKm;
        const yMax = dog.y + prefferedDistanceKm;
        const zMin = dog.z - prefferedDistanceKm;
        const zMax = dog.z + prefferedDistanceKm;

        const foundDogs = await DogModel.findAll({
            where: {
                id: { [Op.notIn]: dogMatchesExcluder }, // excluding dogs that already has match with
                ownerId: { [Op.ne]: userId }, //excluding user's dogs
                x: { [Op.between]: [xMin, xMax] },
                y: { [Op.between]: [yMin, yMax] },
                z: { [Op.between]: [zMin, zMax] },
                isFemale: { [Op.ne]: dog.isFemale }, //checking for other gender
            },
            order: Sequelize.literal("RANDOM()"),
            limit: maxMatches,
        });

        const foundDog = foundDogs.map((d) => d.dataValues);
        console.log("\n\nfound dogs");
        // console.log(foundDog);
        return foundDog;
    } catch (error) {
        console.log(error);
    }
}

//funckja która oblicza dolną i górną wysokośc, z podanej

//dodac w db w danych psa X,Y,Z -> szukamy w pierwszej iter po boundingBox,
