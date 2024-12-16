
// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from 'sequelize';
import { db } from '../utils/db.js';

/**
 * @typedef DogRaceAttr
 * @type {object}
 * @property {Number} id
 * @property {String} name
 * @property {string} dogImagePath
 */

/**
 * @typedef DogRaceCreateAttr
 * @type {object}
 * @property {String} name
 * @property {string} dogImagePath
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<DogRaceAttr, DogRaceCreateAttr>>}
 */
export const DogRaceModel = db.define(
    'dog_races',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dogImagePath: {
            type: DataTypes.STRING(1024),
            key: 'dog_image_path',
            allowNull: false,
        }
    },
    {
        createdAt:false,
        updatedAt:false
    }
);