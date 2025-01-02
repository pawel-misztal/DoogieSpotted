import Path from 'node:path';
import {promises as fs}from 'node:fs';
import { DogPhotoModel } from '../models/dogPhoto.model.js';

const pathFromBackend = './protected/dogs'

/**
 * returns relative path from the server parent( cd .. from server.js folder) to files destination 
 * @returns {string}
 */
export const GetMulterPath = pathFromBackend;

/**
 * delete file with path
 * @param {string} path 
 * @param {number} imageId
 */
export async function DeletePhotoAtPath(path, imageId) {
    try {
        const deletePath = Path.join(import.meta.dirname,'..', '..', path);
        await fs.unlink(deletePath);
        await DogPhotoModel.destroy({
            where: {
                id: imageId
            }
        });
    } catch (e) {
        console.log(e);
    }
}