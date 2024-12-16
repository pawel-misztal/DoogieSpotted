import { db } from "../utils/db.js";
// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from 'sequelize';
import { DogModel } from "./dog.model.js";

/**
 * @typedef MatchesAttr
 * @type {object}
 * @property {number} id
 * @property {number} lowerDogId
 * @property {number} higherDogId
 * @property {boolean} lowerDogViewed //this is used to determine if dog seen that dog has new match
 * @property {boolean} higherDogViewed //this is used to determine if dog seen that dog has new match
 * @property {Date} createdAt
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<MatchesAttr,MatchesAttr>>}
 */
export const MatchesModel = db.define(
    'matches',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lowerDogId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { 
                model: DogModel,
                key: 'id'
            }
        },
        higherDogId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { 
                model: DogModel,
                key: 'id'
            }
        },
        lowerDogViewed: {
            type: DataTypes.BOOLEAN,
            allowNull:false
        },
        higherDogViewed: {
            type: DataTypes.BOOLEAN,
            allowNull:false
        }, 
    },
    {
        createdAt: true,
        updatedAt: false
    }
)