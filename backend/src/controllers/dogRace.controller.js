// eslint-disable-next-line no-unused-vars
import express from 'express'
import { DogRaceModel } from '../models/dogRace.model.js';



/**
 * 
 * @param {express.Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {express.Response<any, Record<string, any>, number>} res 
 */
export async function dogRaces(req, res, next) {
    try {
        const found = await DogRaceModel.findAll({
            attributes: ['id', 'name']
        })
    
        res.json(found);
    } catch (e) {
        next(e)
    }
}

/**
 * @typedef RequestId
 * @type {object}
 * @property {number} id
 */

/**
 * 
 * @param {express.Request<RequestId, any, any, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {express.Response<any, Record<string, any>, number>} res 
 */
export async function dogRaceById(req,res, next) {
    try {
        const dogRaceId = Number.parseInt(req.params.id);
        const found = await DogRaceModel.findByPk(dogRaceId);
        res.json(found);
    } catch (e) {
        next(e)
    }
}