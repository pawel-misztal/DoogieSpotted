// export const API_ADDR = "https://komputerpawla:3001";
export const API_ADDR = `https://${location.host}`;
// export const API_ADDR = "https://192.168.6.175:3001";

export const DEFAULT_IMG_PATH = "/dogImagePlaceholder.png";

/** `/api/dailyMatches/${selectedDogId}`*/
export const GET_DAILY_MATCHES_ADDR = (selectedDogId: number) =>
    `/api/dailyMatches/${selectedDogId}`;

/** `/api/dailyMatches/${selectedDogId}/${dailyMatchId}/rate/${like ? 1 : -1}` */
export const POST_RATE_DAILY_MATCH_ADDR = (
    selectedDogId: number,
    dailyMatchId: number,
    like: boolean
) => `/api/dailyMatches/${selectedDogId}/${dailyMatchId}/rate/${like ? 1 : -1}`;

export const GET_DOGS_ADDR = "/api/dogs";

/** `/api/dogs/${dogId}` */
export const GET_DOG_ADDR = (dogId: number) => `/api/dogs/${dogId}`;

/** `/api/dogs/${dogId}/images` */
export const GET_DOG_IMAGES_ADDR = (dogId: number) =>
    `/api/dogs/${dogId}/images`;

/** `${API_ADDR}/api/dogs/${dogId}/images/${dogImgId}` */
export const GET_DOG_IMG_PATH_ADDR = (dogId: number, dogImgId: number) =>
    `${API_ADDR}/api/dogs/${dogId}/images/${dogImgId}`;

/** `${API_ADDR}/api/dailyMatches/${dogId}/preferences` */
export const GET_DOG_PREFERENCES = (dogId: number) =>
    `${API_ADDR}/api/dailyMatches/${dogId}/preferences`;

export const POST_RESET_PASSWORD = "/api/users/resetPassword";
