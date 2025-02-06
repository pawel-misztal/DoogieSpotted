import express from "express";
import { TryGetUser } from "./auth.js";
import { DogModel } from "../models/dog.model.js";

/**
 * it will put to req.dog found dog from db if user has this dog, and dog was found in db
 * @param {express.Request<DogId>} req
 * @param {express.Response} res
 * @param {function()} next
 */
export async function HasDog(req, res, next) {
    try {
        const dogId = req.params.dogId;
        const userId = TryGetUser(req);

        const dog = await IsDogOwnedByUser(dogId, userId);
        if (!dog) {
            res.sendStatus(401);
        } else {
            req.dog = dog;
            next();
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
export async function IsDogOwnedByUser(dogId, userId) {
    try {
        const foundDog = await DogModel.findByPk(dogId);

        if (!foundDog || foundDog.dataValues.ownerId != userId) {
            return false;
        }

        return foundDog.dataValues;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 *
 * @param {express.Request} req
 * @returns {import('../models/dog.model.js').DogAttr}
 */
export function GetDogFromRequest(req) {
    return req.dog;
}
