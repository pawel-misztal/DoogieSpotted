import { Router } from "express";
import { GetMyDogs, AddNewDog, TryGetDogById} from '../controllers/dog.controller.js';

const router = Router();

router.get('/id/:id', TryGetDogById);
// router.get('/images/:id', tryGetDogImage);
router.post('/', AddNewDog);
// router.put('/', updateExistingDog);
router.get('/', GetMyDogs);

export default router;