import $http from "./xhr";

export const authLogin = async (data: any) => await $http.post("/auth/login", data);

export const cardGetAll = async () => await $http.get(`/cards/`);
export const cardGetAllByMe = async () => await $http.get(`/cards/user/me`);
export const cardGetAllByUser = async (userId: string) => await $http.get(`/cards/user/${userId}`);
export const cardGetAllWithHashtags = async () => await $http.get(`/cards/with-hashtags`);
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

// Game Play
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
export const organisationGetOneExportData = async (organisationId: string) => await $http.get(`/organisations/export/${organisationId}`);
export const organisationDelete = async (organisationId: string) => await $http.delete(`/organisations/${organisationId}`);
export const organisationUpdate = async (organisationId: string, data: any) => await $http.put(`/organisations/${organisationId}`, data);

export const userGetAll = async () => await $http.get(`/users/`);
export const userGetMe = async () => await $http.get(`/users/me`);
export const userCreate = async (data: any) => await $http.post(`/users/`, data);
export const userGetOne = async (userId: string) => await $http.get(`/users/${userId}`);
export const userDelete = async (userId: string) => await $http.delete(`/users/${userId}`);
export const userUpdate = async (userId: string, data: any) => await $http.put(`/users/${userId}`, data);
export const userUpdateRole = async (userId: string, data: any) => await $http.patch(`/users/${userId}/update-role`, data);

export const hashtagGetAll = async () => await $http.get(`/hashtags/`);
export const hashtagGetAllTitles = async () => await $http.get(`/hashtags/titles`);
export const hashtagGetAllWithParents = async () => await $http.get(`/hashtags/with-parents`);
export const hashtagCreate = async (data: any) => await $http.post(`/hashtags/`, data);
export const hashtagGetOne = async (hashtagId: string) => await $http.get(`/hashtags/${hashtagId}`);
export const hashtagDelete = async (hashtagId: string) => await $http.delete(`/hashtags/${hashtagId}`);
export const hashtagUpdate = async (hashtagId: string, data: any) => await $http.put(`/hashtags/${hashtagId}`, data);

export const projectGetAll = async () => await $http.get(`/projects/`);
export const projectGetAllByOrganisation = async (organisationId: string) => await $http.get(`/projects/org/${organisationId}`);
export const projectCreate = async (data: any) => await $http.post(`/projects/`, data);
export const projectGetOne = async (projectId: string) => await $http.get(`/projects/${projectId}`);
export const projectDelete = async (projectId: string) => await $http.delete(`/projects/${projectId}`);
export const projectUpdate = async (projectId: string, data: any) => await $http.put(`/projects/${projectId}`, data);

// export const demoGetAll = async () => await $http.get(`/demos/`);
// export const demoGetAllByMe = async () => await $http.get(`/demos/mine`);
// export const demoCreate = async (data: any) => await $http.post(`/demos/`, data);
// export const demoGetOne = async (demoId: string) => await $http.get(`/demos/${demoId}`);
// export const demoDelete = async (demoId: string) => await $http.delete(`/demos/${demoId}`);
// export const demoUpdate = async (demoId: string, data: any) => await $http.put(`/demos/${demoId}`, data);
