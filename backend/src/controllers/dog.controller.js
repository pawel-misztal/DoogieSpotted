import express, { response } from 'express';
import { TryGetUser } from '../middlewares/auth.js';
import { DogModel } from '../models/dog.model.js';
import { DogPhotoModel } from '../models/dogPhoto.model.js';
import Path from 'node:path';
import multer from 'multer';


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
 * @property {String} name
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
            name: dogData.name,
            latitude: dogData.latitude,
            longitude: dogData.longitude
        });

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

/**
 * 
 * @param {express.Request<DogId>} req 
 * @param {express.Response} res 
 */
export async function TryGetDogImages(req,res) {
    const dogId = req.params.id;
    const userId = TryGetUser(req);

    try {
        const foundDog = await DogModel.findByPk(dogId);
        const foundPhotos = await DogPhotoModel.findAll({
            where: {
                dogId: dogId
            }
        });

        if(!foundDog)
        {
            res.sendStatus(403);
            return;
        }

        // TODO: also search if dog has matches with that dog 
        if(foundDog.dataValues.ownerId != userId)
        {
            res.sendStatus(403);
            return;
        }

        

        const onlyPhotos = foundPhotos.map(photo => photo.dataValues);
        res.json(onlyPhotos);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}



/**
 * @typedef ImageId
 * @type {object}
 * @property {number} imageId
 */

/**
 * 
 * @param {express.Request<DogId & ImageId>} req 
 * @param {express.Response} res 
 */
export async function TryGetDogImage(req,res) {
    const dogId = req.params.id;
    const dogPhotoId = req.params.imageId;
    const userId = TryGetUser(req);

    try {
        const foundDog = await DogModel.findByPk(dogId);
        const foundImage = await DogPhotoModel.findByPk(dogPhotoId);

        if(!foundDog)
            throw new Error('no dog was found');

        // TODO: add validation if reqiested dog can see this dog
        if(foundDog.dataValues.ownerId != userId)
            throw new Error('cant see this dog');

        if(!foundImage)
            throw new Error('cant find that image');

        const imagePath = foundImage.dataValues.imagePath;
        if(imagePath === null || imagePath === '')
        {
            await DogPhotoModel.destroy({
                where: {
                    id: dogPhotoId
                }
            })
            throw new Error('invalid image path, deleting image from db');
        }

        // TODO: readFile > send 
        // TEMP: send file path

        // res.send(imagePath);
        res.sendFile(Path.join(import.meta.dirname,'..','..',imagePath));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}



/**
 * 
 * @param {express.Request<DogId>} req 
 * @param {express.Response} res 
 */
export async function DeleteDogById(req, res) {
    try {
        const dogId = req.params.id;

        // TODO: delete photos CASE: dogController211

        await DogPhotoModel.destroy({
            where: {
                dogId: dogId
            }
        });

        //This can be done safely, because, in previous step, it was chcecked if user has this dog
        const destoryedDogs = await DogModel.destroy({
            where: {
                id: dogId
            }
        });
        

        if(destoryedDogs > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

/**
 * 
 * @param {express.Request<DogId>} req 
 * @param {express.Response} res 
 * @param {function()} next 
 */
export async function HasDog(req,res,next) {
    const dogId = req.params.id;
    const userId = TryGetUser(req);

    try {
        const hasDog = await IsDogOwnedByUser(dogId, userId);
        if(!hasDog) {
            res.sendStatus(401);
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

/**
 * 
 * @param {express.Request<DogId>} req 
 * @param {express.Response} res 
 */
export async function AddImage(req, res) {
    const dogId = req.params.id;
    const userId = TryGetUser(req);

    try {
        // TODO: take image > validate > compress > save > get saved path CASE: 272dogController

        const savedPhoto = await DogPhotoModel.create({
            dogId: dogId,
            imagePath: req.file.path
        });

        if(savedPhoto === null) {
            res.sendStatus(400);
        } else { 
            res.json(savedPhoto.dataValues);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

/**
 * 
 * @param {number} dogId 
 * @param {number} userId 
 * @returns 
 */
async function IsDogOwnedByUser(dogId, userId) {
    const foundDog = await DogModel.findByPk(dogId);
        
    if(!foundDog || foundDog.dataValues.ownerId != userId)
    {
        return false;
    }

    return foundDog.dataValues;
}