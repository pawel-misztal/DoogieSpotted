import { createContext } from "react";
import { dogModel } from "../models/dogModel";

export enum MyDogsMode {
    list,
    create,
    edit,
}
export interface MyDogsContext {
    backButtonClicked: () => void;
    mode: MyDogsMode;
    dogId: number | undefined;
    dogs: [dogModel] | undefined;
}
export const MyDogsContext = createContext<MyDogsContext>({
    backButtonClicked: () => {},
    mode: MyDogsMode.edit,
    dogId: 0,
    dogs: undefined,
});
