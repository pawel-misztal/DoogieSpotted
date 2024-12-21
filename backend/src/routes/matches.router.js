import { Router } from "express";
import { getDogMatches, markMatchVieved } from "../controllers/matches.controller.js";
import { TryGetUser } from "../middlewares/auth.js";
import { DogModel } from "../models/dog.model.js";

const matchesRouter = Router();

matchesRouter.get('/:dogId', HasDog, getDogMatches)
matchesRouter.post('/:dogId/:matchId/markView', HasDog, markMatchVieved)


export { matchesRouter }


/**
 * 
 * @param {express.Request<DogId>} req 
 * @param {express.Response} res 
 * @param {function()} next 
 */
async function HasDog(req, res, next) {
    const dogId = req.params.dogId;
    const userId = TryGetUser(req);

    const foundDog = await DogModel.findByPk(dogId);
        
    if(!foundDog || foundDog.dataValues.ownerId != userId)
    {
        res.sendStatus(401);
    } else {
        next();
    }
}



