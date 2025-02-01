import express, { response } from "express";
import { TryGetUser } from "../middlewares/auth.js";
import { DogModel } from "../models/dog.model.js";
import { DogPhotoModel } from "../models/dogPhoto.model.js";
import Path from "node:path";
import multer from "multer";
import {
    CompressFileWithDelete,
    DeletePhotoAtPath,
} from "../utils/dogPhotosManager.js";
import { LonLatToPos } from "../utils/loacationUtils.js";
import {
    DEFAULT_SEARCH_RANGE_KM,
    DogFindPreferencesModel,
} from "../models/dogFindPreferences.mode.js";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function GetMyDogs(req, res, next) {
    try {
        const userId = TryGetUser(req);

        const foundDogs = await DogModel.findAll({
            where: {
                ownerId: userId,
            },
        });
        res.json(foundDogs);
    } catch (e) {
        next(e);
    }
}

/**
 * @typedef RequestDogPost
 * @type {object}
 * @property {Number} raceId
 * @property {Number} ownerId
 * @property {boolean} isFemale
 * @property {String} name
 * @property {Date} birthDate
 * @property {String} phoneNumber
 * @property {String} description
 * @property {Number} latitude
 * @property {Number} longitude
 */

/**
 *
 * @param {express.Request<any, any, RequestDogPost, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 */
export async function AddNewDog(req, res, next) {
    try {
        const userId = TryGetUser(req);

        const dogData = req.body;

        const pos = LonLatToPos(dogData.longitude, dogData.latitude);

        console.log(dogData);

        const createdDog = await DogModel.create({
            raceId: dogData.raceId,
            ownerId: userId,
            isFemale: dogData.isFemale,
            description: dogData.description,
            name: dogData.name,
            birthDate: dogData.birthDate,
            phoneNumber: dogData.phoneNumber,
            latitude: dogData.latitude,
            longitude: dogData.longitude,
            x: pos.x,
            y: pos.y,
            z: pos.z,
        });

        console.log("created");

        if (!createdDog) {
            res.sendStatus(500);
            return;
        }

        const createdPreferences = await DogFindPreferencesModel.create({
            dogId: createdDog.dataValues.id,
            distance: DEFAULT_SEARCH_RANGE_KM,
        });

        res.json(createdDog.dataValues);
    } catch (e) {
        next(e);
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
export async function TryGetDogById(req, res, next) {
    try {
        const dogId = req.params.id;
        const userId = TryGetUser(req);
        // TODO: add checking if current user has match or dailyMatch with this dog

        const foundDog = await DogModel.findByPk(dogId, {
            where: {
                userId: userId,
            },
        });

        if (foundDog === null) {
            res.sendStatus(403);
            return;
        }

        res.json(foundDog.dataValues);
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 */
export async function TryGetDogImages(req, res, next) {
    try {
        const dogId = req.params.id;
        const userId = TryGetUser(req);

        const foundDog = await DogModel.findByPk(dogId);
        const foundPhotos = await DogPhotoModel.findAll({
            where: {
                dogId: dogId,
            },
            attributes: ["id", "dogId"],
        });

        if (!foundDog) {
            res.sendStatus(403);
            return;
        }

        // TODO: also search if dog has matches with that dog
        if (foundDog.dataValues.ownerId != userId) {
            res.sendStatus(403);
            return;
        }

        const onlyPhotos = foundPhotos.map((photo) => photo.dataValues);
        res.json(onlyPhotos);
    } catch (e) {
        next(e);
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
export async function TryGetDogImage(req, res, next) {
    try {
        const dogId = req.params.id;
        const dogPhotoId = req.params.imageId;
        const userId = TryGetUser(req);

        const foundDog = await DogModel.findByPk(dogId);
        const foundImage = await DogPhotoModel.findByPk(dogPhotoId);

        if (!foundDog) throw new Error("no dog was found");

        // TODO: add validation if reqiested dog can see this dog
        if (foundDog.dataValues.ownerId != userId)
            throw new Error("cant see this dog");

        if (!foundImage) throw new Error("cant find that image");

        const imagePath = foundImage.dataValues.imagePath;
        if (imagePath === null || imagePath === "") {
            await DogPhotoModel.destroy({
                where: {
                    id: dogPhotoId,
                },
            });
            throw new Error("invalid image path, deleting image from db");
        }

        // TODO: readFile > send
        // TEMP: send file path

        // res.send(imagePath);
        res.sendFile(Path.join(import.meta.dirname, "..", "..", imagePath));
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 */
export async function DeleteDogById(req, res, next) {
    try {
        const dogId = req.params.id;

        // TODO: delete photos CASE: dogController211
        const photosModels = await DogPhotoModel.findAll({
            where: {
                dogId: dogId,
            },
        });

        /** @type {Promise<void>[]} */
        const deletePhotosPromises = [];
        photosModels.forEach((photoModel) => {
            deletePhotosPromises.push(
                DeletePhotoAtPath(
                    photoModel.dataValues.imagePath,
                    photoModel.dataValues.id
                )
            );
        });
        await Promise.all(deletePhotosPromises);

        //This can be done safely, because, in previous step, it was chcecked if user has this dog
        const destoryedDogs = await DogModel.destroy({
            where: {
                id: dogId,
            },
        });

        if (destoryedDogs > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<any, any, RequestDogPost, any, any>} req
 * @param {express.Response} res
 * @param {function()} next
 */
export async function UpdateDogById(req, res, next) {
    try {
        const dogId = req.params.id;
        const dogData = req.body;

        const updatedCount = await DogModel.update(
            {
                ...dogData,
                id: dogId,
            },
            {
                where: {
                    id: dogId,
                },
            }
        );

        if (updatedCount[0] === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 * @param {function()} next
 */
export async function HasDog(req, res, next) {
    try {
        const dogId = req.params.id;
        const userId = TryGetUser(req);
        console.log("authorizing user with id: " + userId + " dog: " + dogId);

        const hasDog = await IsDogOwnedByUser(dogId, userId);
        if (!hasDog) {
            res.sendStatus(401);
        } else {
            next();
        }
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 */
export async function DeleteAllImages(req, res, next) {
    try {
        const dogId = req.params.id;

        console.log("removing dog id " + dogId);

        const photoModels = await DogPhotoModel.findAll({
            where: {
                dogId: dogId,
            },
        });

        console.log(photoModels);

        if (!photoModels) {
            res.sendStatus(200);
            return;
        }

        const deletePromises = photoModels.map((m) => {
            return DeletePhotoAtPath(m.dataValues.imagePath, m.dataValues.id);
        });

        await Promise.all(deletePromises);

        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 */
export async function RemoveSingleImage(req, res, next) {
    try {
        const dogId = req.params.id;
        const dogPhotoId = req.params.imageId;

        console.log("removing ");

        const photoModel = await DogPhotoModel.findOne({
            where: {
                dogId: dogId,
                id: dogPhotoId,
            },
        });

        if (!photoModel || !photoModel.dataValues) {
            res.sendStatus(403);
            return;
        }

        await DeletePhotoAtPath(
            photoModel.dataValues.imagePath,
            photoModel.dataValues.id
        );
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function AddImage(req, res, next) {
    try {
        const dogId = Number.parseInt(req.params.id);
        let filePath = req.file?.path;
        if (filePath === null) throw Error("no file attached");

        // TODO: take image > validate > compress > save > get saved path CASE: 272dogController

        filePath = await CompressFileWithDelete(filePath);

        if (filePath === null)
            throw Error("something Went wrong during compression");

        const savedPhoto = await DogPhotoModel.create({
            dogId: dogId,
            imagePath: filePath,
        });

        if (savedPhoto === null) {
            res.sendStatus(400);
        } else {
            res.json({
                id: savedPhoto.dataValues.id,
                dogId: savedPhoto.dataValues.dogId,
            });
        }
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {number} dogId
 * @param {number} userId
 * @returns
 */
async function IsDogOwnedByUser(dogId, userId) {
    try {
        const foundDog = await DogModel.findByPk(dogId);
        console.log(foundDog);

        if (!foundDog || foundDog.dataValues.ownerId != userId) {
            return false;
        }

        return foundDog.dataValues;
    } catch (e) {
        console.log(e);
        return false;
    }
}
