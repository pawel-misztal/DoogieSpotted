import { DogRaceModel } from "../dogRace.model.js";




export const populateMockDogRace = () => Promise.all(
    [
        DogRaceModel.create({
            name: 'wykres',
            dogImagePath: 'dog1.png'
        }),
        DogRaceModel.create({
            name: 'dupczyciel',
            dogImagePath: ''
        })
    ]
);