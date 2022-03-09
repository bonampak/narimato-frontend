import $http from "./xhr";

export const authLogin = async (data: any) => await $http.post("/auth/login", data);

export const cardGetAll = async () => await $http.get(`/cards/`);
export const cardGetAllByMe = async () => await $http.get(`/cards/user/me`);
export const cardGetAllByUser = async (userId: string) => await $http.get(`/cards/user/${userId}`);
export const cardGetAllHashtags = async () => await $http.get(`/cards/hashtags`);
export const cardCreate = async (data: any) => await $http.post(`/cards/`, data);
export const cardGetOne = async (cardId: string) => await $http.get(`/cards/${cardId}`);
export const cardDelete = async (cardId: string) => await $http.delete(`/cards/${cardId}`);
export const cardUpdate = async (cardId: string, data: any) => await $http.put(`/cards/${cardId}`, data);

export const gameGetAll = async () => await $http.get(`/games/`);
export const gameGetAllByMe = async () => await $http.get(`/games/user/me`);
export const gameCheckIfNewCard = async () => await $http.get(`/games/user/check-new-card`);
export const gameGetAllByUser = async (userId: string) => await $http.get(`/games/user/${userId}`);
export const gameCreate = async (data: any) => await $http.post(`/games/`, data);
export const gameGetOne = async (gameId: string) => await $http.get(`/games/${gameId}`);
export const gameDelete = async (gameId: string) => await $http.delete(`/games/${gameId}`);
export const gameUpdate = async (gameId: string, data: any) => await $http.put(`/games/${gameId}`, data);

export const gameNewCard = async (gameId: string) => await $http.post(`games/${gameId}/card/new`);
export const gameNewHashtag = async (gameId: string) => await $http.post(`games/${gameId}/hashtag/new`);
export const gameAddLeftSwipedCard = async (gameId: string, data: any) => await $http.post(`games/${gameId}/card/add-left-swiped-card`, data);
export const gameAddRightSwipedCard = async (gameId: string, data: any) => await $http.post(`games/${gameId}/card/add-right-swiped-card`, data);
export const gameUpdateRightSwipedCards = async (gameId: string, data: any) => await $http.put(`games/${gameId}/card/update-right-swiped-cards`, data);
export const gameAddLeftSwipedHashtag = async (gameId: string, data: any) => await $http.post(`games/${gameId}/hashtag/add-left-swiped-hashtag`, data);
export const gameAddRightSwipedHashtag = async (gameId: string, data: any) => await $http.post(`games/${gameId}/hashtag/add-right-swiped-hashtag`, data);

export const organisationGetAll = async () => await $http.get(`/organisations/`);
export const organisationCreate = async (data: any) => await $http.post(`/organisations/`, data);
export const organisationGetOne = async (organisationId: string) => await $http.get(`/organisations/${organisationId}`);
export const organisationGetOneBySlugUrl = async (slugUrl: string) => await $http.get(`/organisations/slug/${slugUrl}`);
export const organisationDelete = async (organisationId: string) => await $http.delete(`/organisations/${organisationId}`);
export const organisationUpdate = async (organisationId: string, data: any) => await $http.put(`/organisations/${organisationId}`, data);

export const userGetAll = async () => await $http.get(`/users/`);
export const userGetMe = async () => await $http.get(`/users/me`);
export const userCreate = async (data: any) => await $http.post(`/users/`, data);
export const userGetOne = async (userId: string) => await $http.get(`/users/${userId}`);
export const userDelete = async (userId: string) => await $http.delete(`/users/${userId}`);
export const userUpdate = async (userId: string, data: any) => await $http.put(`/users/${userId}`, data);
export const userUpdateRole = async (userId: string, data: any) => await $http.patch(`/users/${userId}/update-role`, data);

// export const demoGetAll = async () => await $http.get(`/demos/`);
// export const demoGetAllByMe = async () => await $http.get(`/demos/mine`);
// export const demoCreate = async (data: any) => await $http.post(`/demos/`, data);
// export const demoGetOne = async (demoId: string) => await $http.get(`/demos/${demoId}`);
// export const demoDelete = async (demoId: string) => await $http.delete(`/demos/${demoId}`);
// export const demoUpdate = async (demoId: string, data: any) => await $http.put(`/demos/${demoId}`, data);
