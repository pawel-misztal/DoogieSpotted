import express, { response } from 'express';
import { TryGetUser } from '../middlewares/auth.js';
import { DogModel } from '../models/dog.model.js';

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export async function GetMyDogs(req, res) {
    const userId = TryGetUser(req);
    
    try {
        const foundDogs = await DogModel.findAll({
            where: {
            ownerId: userId
            }
        });
        res.json(foundDogs);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

/**
 * @typedef RequestDogPost
 * @type {object} 
 * @property {Number} raceId
 * @property {Number} ownerId
 * @property {String} description
 * @property {Number} latitude
 * @property {Number} longitude 
 */

/**
 * 
 * @param {express.Request<any, any, RequestDogPost, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {express.Response<any, Record<string, any>, number>} res 
 */
export async function AddNewDog(req, res) {
    const userId = TryGetUser(req);

    const dogData = req.body;

    try {
        const createdDog = await DogModel.create({
            raceId: dogData.raceId,
            ownerId: userId,
            description: dogData.description,
            latitude: dogData.latitude,
            longitude: dogData.longitude
        });

        console.log(createdDog);
        res.json(createdDog.dataValues);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


/**
 * @typedef DogId
 * @type {object}
 * @property {number} id
 */


/**
 * @param {express.Request<DogId, any, any, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {express.Response} res 
 */
export async function TryGetDogById(req, res) {
    const dogId = req.params.id;
    const userId = TryGetUser(req);
    // TODO: add checking if current user has match or dailyMatch with this dog


    try {
        const foundDog = await DogModel.findByPk(dogId,{
            where: { 
                userId: userId
            }
        });

        if(foundDog === null)
        {
            res.sendStatus(403);
            return;
        }

        res.json(foundDog.dataValues);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}