export interface dogModel {
    id: number;
    raceId: number;
    ownerId: number;
    isFemale: boolean;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    x: number;
    y: number;
    z: number;
    createdAt: Date;
    updatedAt: Date;
    imgPath: string;
}

export interface CreateDogModel {
    raceId: number;
    isFemale: boolean;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
}

export type myDogs = [dogModel];
