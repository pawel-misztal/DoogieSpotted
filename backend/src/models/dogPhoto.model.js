import { db } from "../utils/db.js";
// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from 'sequelize'
import { DogModel } from "./dog.model.js";


/**
 * @typedef DogPhotoAttr
 * @type {object}
 * @property {number} id
 * @property {number} dogId
 * @property {string} imagePath
 */

/**
 * @typedef DogPhotoCreateAttr
 * @type {object}
 * @property {number} dogId
 * @property {string} imagePath
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<DogPhotoAttr,DogPhotoCreateAttr>>}
 */
export const DogPhotoModel = db.define(
    "dog_photo",
    {
        id: {
             type: DataTypes.INTEGER,
             primaryKey: true,
             autoIncrement: true
        },
        dogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: DogModel,
                key: 'id'
            },
            key: 'dog_id'
        },
        imagePath: {
            type: DataTypes.STRING(1024),
            allowNull: false,
            key: 'image_path'
        }
    },
    {
        createdAt: true,
        updatedAt: true
    }
)