export interface MatchModel {
    id: number;
    otherDog: number; //match dog id, id of other dog
    viewed: boolean; //indicates if my dog(not match dog) viewed that match, used for notification
}

export interface DailyMatchModel {
    id: number;
    lowerDogId: number;
    higherDogId: number;
    lowerDogLiked: boolean;
    higherDogLiked: boolean;
    expirationDate: number;
    createdAt: Date;
}
