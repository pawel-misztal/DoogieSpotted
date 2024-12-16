// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from "sequelize";
import { db } from "../utils/db.js";
import { DogRaceModel } from "./dogRace.model.js";
import { UserModel } from "./users.model.js";

/**
 * @typedef DogRaceCreateAttr
 * @type {object} 
 * @property {Number} raceId
 * @property {Number} ownerId
 * @property {String} description
 * @property {Number} latitude
 * @property {Number} longitude
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef DogRaceAttr
 * @type {object} 
 * @property {Number} id
 * @property {Number} raceId
 * @property {Number} ownerId
 * @property {String} description
 * @property {Number} latitude
 * @property {Number} longitude
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<DogRaceAttr,DogRaceCreateAttr>>}
 */
export const DogModel = db.define(
    'dog',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        raceId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
                model: DogRaceModel,
                key: 'id'
            }
        },
        ownerId: {
            type: DataTypes.INTEGER,
            references: {
                model: UserModel,
                key: 'id'
            },
            allowNull: false,
            key: 'owner_id'
        },
        description: {
            type: DataTypes.STRING(2048),
            validate: {
                len: [0, 2048]
            }
        },
        latitude: { 
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        createdAt: true,
        updatedAt: true
    }
)