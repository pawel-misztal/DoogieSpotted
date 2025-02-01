import { Router } from "express";
import {
    GetMyDogs,
    AddNewDog,
    TryGetDogById,
    TryGetDogImages,
    TryGetDogImage,
    DeleteDogById,
    AddImage,
    HasDog as HasThisDog,
    RemoveSingleImage,
    UpdateDogById,
    DeleteAllImages,
} from "../controllers/dog.controller.js";
import multer from "multer";
import { TryGetUser } from "../middlewares/auth.js";
import crypto from "node:crypto";
import { GetMulterPath } from "../utils/dogPhotosManager.js";

const multerInstance = multer({
    limits: {
        files: 1,
        fileSize: 1_000_000,
    },
    // dest: './protected/dogs',
    storage: multer.diskStorage({
        destination: GetMulterPath, //it use path relative to server.js parent folder
        filename: (req, file, cb) => {
            const userId = TryGetUser(req);
            const dogId = req.params.id;

            if (!userId || !dogId) {
                cb(Error("no enough data"), null);
                return;
            }

            cb(null, `${userId}_${dogId}_${crypto.randomUUID()}.jpg`);
        },
    }),
});
const upload = multerInstance.single("dogPhoto");

const router = Router();

router.get("/:id", TryGetDogById);
router.get("/:id/images", TryGetDogImages);
router.post(
    "/:id/images",
    HasThisDog,
    multerInstance.single("dogPhoto"),
    AddImage
);
router.delete("/:id/images/:imageId", HasThisDog, RemoveSingleImage);
router.delete("/:id/images", HasThisDog, DeleteAllImages);
router.get("/:id/images/:imageId", TryGetDogImage);
router.post("/", AddNewDog);
// router.put('/', updateExistingDog);
router.get("/", GetMyDogs);
router.delete("/:id", HasThisDog, DeleteDogById);
router.put("/:id", HasThisDog, UpdateDogById);
// router.use((err,req,res,next) => {
//     const errorUUID = crypto.randomUUID();
//     console.log(`Error UUID: ${errorUUID} error: \n${err}`);
//     res.status(500).send(errorUUID);
// })

export default router;
