import { createContext } from "react";
import { dogModel } from "../models/dogModel";

export enum MyDogsMode {
    list,
    create,
    edit,
}
export interface MyDogsContext {
    backButtonClicked: () => void;
    reloadDogs: () => void;
    mode: MyDogsMode;
    dogId: number | undefined;
    dogs: [dogModel] | undefined;
}
export const MyDogsContext = createContext<MyDogsContext>({
    backButtonClicked: () => {},
    reloadDogs: () => {},
    mode: MyDogsMode.edit,
    dogId: 0,
    dogs: undefined,
});
