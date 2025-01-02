import { DataTypes } from "sequelize";
import { db } from "../utils/db.js";
import { DogModel } from "./dog.model.js";
import { DogRaceModel } from "./dogRace.model.js";
import sequelize from 'sequelize';

/** 
 * @typedef {object} DogFindPreferencesModelAttr 
 * @property {number} dogId
 * @property {number} distance
 * */

/** @type {sequelize.ModelStatic<sequelize.Model<DogFindPreferencesModelAttr,DogFindPreferencesModelAttr>>} */
export const DogFindPreferencesModel = db.define(
    'dog_find_preferences',
    {
        dogId: {
            type: DataTypes.INTEGER,
            references: {
                model: DogModel,
                key: 'id'
            },
        },
        distance: { 
            type: DataTypes.FLOAT
        },
    }
)

DogModel.hasOne(DogFindPreferencesModel);
DogFindPreferencesModel.belongsTo(DogModel);

export const DogFindRacePreferenceModel = db.define(
    'dog_find_race_preference',
    {
        dogId: {
            type: DataTypes.INTEGER,
            references: {
                model: DogModel,
                key: 'id'
            }
        },
        preferedRaceId: {
            type: DataTypes.INTEGER,
            references: { 
                model: DogRaceModel,
                key: 'id'
            }
        }
    }
)