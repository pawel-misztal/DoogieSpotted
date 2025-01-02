import { Op } from "sequelize";
import { DogModel } from "../models/dog.model.js";
import { DogFindPreferencesModel } from "../models/dogFindPreferences.mode.js";
import { MatchesModel } from "../models/matches.model.js";

const dailyMatches = 4;

//sprawdzić czy nie maczuje ci twojego psa 
//zrobić liste psów które potrzebują macza 

// bierzemy psa i szukamy mu 4 losowe psy z rasą których nie ma w maczach 


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
            },
            // include: {
            //     model: DogFindPreferencesModel,
            //     where: {
            //         distance: { [Op.gte] : prefferedDistanceKm } //checking bounding if other dog has at least the same distance 
            //     }
            // }
        });
    
        const foundDog = foundDogs.map(d => d.dataValues);
        console.log("\n\nfound dogs");
        console.log(foundDog);
    
    } catch (error) {
        console.log(error);
    }
}



//funckja która oblicza dolną i górną wysokośc, z podanej 

//dodac w db w danych psa X,Y,Z -> szukamy w pierwszej iter po boundingBox, 
