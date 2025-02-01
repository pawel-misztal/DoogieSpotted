import Path from "node:path";
import { promises as fs } from "node:fs";
import { DogPhotoModel } from "../models/dogPhoto.model.js";
import sharp from "sharp";

const pathFromBackend = "./protected/dogs";
sharp.cache(false);

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
        const deletePath = Path.join(import.meta.dirname, "..", "..", path);
        await fs.unlink(deletePath);
    } catch (e) {
        console.log(e);
    }

    try {
        await DogPhotoModel.destroy({
            where: {
                id: imageId,
            },
        });
    } catch (e) {
        console.log(e);
    }
}

/**
 *
 * @param {string} filePath
 */
export async function CompressFileWithDelete(filePath) {
    try {
        console.log("compressing");
        const newFilePath = filePath.replace("_uc", "");
        console.log(filePath);
        console.log(newFilePath);
        const img = sharp(filePath);
        await img
            .resize(512, 512, {
                withoutEnlargement: true,
                fit: "inside",
            })
            .webp({
                quality: 60,
            })
            .toFile(newFilePath);
        // img.destroy();
        // img.end()
        await fs.unlink(filePath);
        return newFilePath;
    } catch (e) {
        console.log("compressor error");
        console.log(filePath);
        console.log(e);
        await fs.unlink(filePath);
        return null;
    }
}
