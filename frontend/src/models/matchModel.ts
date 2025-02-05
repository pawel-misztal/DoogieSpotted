export interface MatchModel {
    id: number;
    otherDog: number; //match dog id, id of other dog
    viewed: boolean; //indicates if my dog(not match dog) viewed that match, used for notification
}
