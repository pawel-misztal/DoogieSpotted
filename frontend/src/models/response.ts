// export class Msg {
//     /**
//      * @param {number} status
//      */
//     constructor(status) {
//         this.status = status;
//     }
// }

export enum StatusCode {
    STATUS_INIT = 0,
    STATUS_NEW_MATCH = 1,
}

export interface Msg {
    status: StatusCode;
}
