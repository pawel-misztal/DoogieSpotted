export interface dogModel {
    id: number;
    raceId: number;
    ownerId: number;
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

export type myDogs = [dogModel];
