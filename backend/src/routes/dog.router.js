import { Router } from "express";
import { GetMyDogs, AddNewDog, TryGetDogById, TryGetDogImages, TryGetDogImage, DeleteDogById, AddImage, HasDog as HasThisDog} from '../controllers/dog.controller.js';
import multer from "multer";
import { TryGetUser } from "../middlewares/auth.js";
import crypto from 'node:crypto';

const upload = multer({limits:
    {
        files: 1,
        fileSize: 1_000_000
    },
    // dest: './protected/dogs',
    storage: multer.diskStorage({
        destination: './protected/dogs', //it use path relative to server.js parent folder 
        filename: (req, res, cb) => {
            const userId = TryGetUser(req);
            const dogId = req.params.id;

            if(!userId || !dogId)
            {
                cb(new Error('no enough data'));
                return;
            }

            cb(null, `${userId}_${dogId}_${crypto.randomUUID()}.jpg`);
        }
    })}
);

const router = Router();

router.get('/:id', TryGetDogById);
router.get('/:id/images', TryGetDogImages);
router.post('/:id/images', HasThisDog, upload.single('dogPhoto'), AddImage);
router.get('/:id/images/:imageId', TryGetDogImage);
router.post('/', AddNewDog);
// router.put('/', updateExistingDog);
router.get('/', GetMyDogs);
router.delete('/:id', HasThisDog, DeleteDogById);

export default router;