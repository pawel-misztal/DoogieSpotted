// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from "sequelize";
import { db } from "../utils/db.js";
import { DogRaceModel } from "./dogRace.model.js";
import { UserModel } from "./users.model.js";



/**
 * @typedef DogAttr
 * @type {object} 
 * @property {Number} id
 * @property {Number} raceId
 * @property {Number} ownerId
 * @property {boolean} isFemale
 * @property {String} name
 * @property {String} description
 * @property {Number} latitude
 * @property {Number} longitude
 * @property {Number} x
 * @property {Number} y
 * @property {Number} z
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<DogAttr,DogAttr>>}
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
        isFemale: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        name: {
            type: DataTypes.STRING
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
        },
        x: {
            type: DataTypes.FLOAT,
        },
        y: {
            type: DataTypes.FLOAT,
        },
        z: {
            type: DataTypes.FLOAT
        }
    },
    {
        createdAt: true,
        updatedAt: true
    }
)