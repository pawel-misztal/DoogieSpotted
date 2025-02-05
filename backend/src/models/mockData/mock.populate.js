import { RegisterInternal } from "../../controllers/user.controller.js";
import { LonLatToPos } from "../../utils/loacationUtils.js";
import { DogModel } from "../dog.model.js";
import { DogFindPreferencesModel } from "../dogFindPreferences.mode.js";
import { DogRaceModel } from "../dogRace.model.js";

const lonLat1 = 21.37;
const lonLat2 = 21.36;

const pos1 = LonLatToPos(lonLat1, lonLat1);
const pos2 = LonLatToPos(lonLat2, lonLat2);

const pos3Far = LonLatToPos(69, 69);

export const populateMockRaces = async () => {
    try {
        const numberOfRaces = await DogRaceModel.count();

        console.log("number of races: " + numberOfRaces);
        if (numberOfRaces > 0) return;

        await DogRaceModel.create({
            name: "wykres",
            dogImagePath: "dog1.png",
        });
        await DogRaceModel.create({
            name: "dupczyciel",
            dogImagePath: "dog2.png",
        });
    } catch (e) {
        console.log(e);
    }
};

export const populateMockData = async () => {
    try {
        // user 1
        await RegisterInternal("test@test.com", "test");
        //dog 1
        await DogModel.create({
            name: "reksio1_1",
            description: "",
            isFemale: false,
            latitude: lonLat1,
            longitude: lonLat1,
            ownerId: 1,
            raceId: 1,
            x: pos1.x,
            y: pos1.y,
            z: pos1.z,
        });
        await DogFindPreferencesModel.create({
            dogId: 1,
            distance: 21,
        });
        //dog2
        await DogModel.create({
            name: "reksina1_2",
            isFemale: true,
            description: "",
            latitude: lonLat1,
            longitude: lonLat1,
            ownerId: 1,
            raceId: 1,
            x: pos1.x,
            y: pos1.y,
            z: pos1.z,
        });
        await DogFindPreferencesModel.create({
            dogId: 2,
            distance: 213,
        });

        // user 2
        await RegisterInternal("test1@test.com", "test1");
        // dog 3
        await DogModel.create({
            name: "reksioina2_1",
            isFemale: true,
            description: "",
            latitude: lonLat1,
            longitude: lonLat1,
            ownerId: 2,
            raceId: 1,
            x: pos1.x,
            y: pos1.y,
            z: pos1.z,
        });
        await DogFindPreferencesModel.create({
            dogId: 3,
            distance: 21,
        });
        //dog4
        await DogModel.create({
            name: "reksio2_2",
            isFemale: false,
            description: "",
            latitude: lonLat1,
            longitude: lonLat1,
            ownerId: 2,
            raceId: 1,
            x: pos1.x,
            y: pos1.y,
            z: pos1.z,
        });
        await DogFindPreferencesModel.create({
            dogId: 4,
            distance: 0.1,
        });

        // user 3
        await RegisterInternal("test2@test.com", "test2");
        //dog 5
        await DogModel.create({
            name: "reksio3_1",
            isFemale: true,
            description: "",
            latitude: lonLat2,
            longitude: lonLat2,
            ownerId: 3,
            raceId: 1,
            x: pos2.x,
            y: pos2.y,
            z: pos2.z,
        });
        await DogFindPreferencesModel.create({
            dogId: 5,
            distance: 21,
        });
        //dog 6
        await DogModel.create({
            name: "reksio3_2",
            isFemale: true,
            description: "",
            latitude: lonLat2,
            longitude: lonLat2,
            ownerId: 3,
            raceId: 1,
            x: pos2.x,
            y: pos2.y,
            z: pos2.z,
        });
        await DogFindPreferencesModel.create({
            dogId: 6,
            distance: 21,
        });

        // user 4
        await RegisterInternal("test3@test.com", "test3");
    } catch (e) {
        console.log(e);
    }
};
