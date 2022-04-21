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

export const surveyGetAll = async () => await $http.get(`/surveys/`);
export const surveyGetAllByMe = async () => await $http.get(`/surveys/user/me`);
export const surveyGetAllByOrganisation = async (organisationId: string) => await $http.get(`/surveys/org/${organisationId}`);
export const surveyCheckIfNewCard = async () => await $http.get(`/surveys/user/check-new-card`);
export const surveyGetAllByUser = async (userId: string) => await $http.get(`/surveys/user/${userId}`);
export const surveyCreate = async (data: any) => await $http.post(`/surveys/`, data);
export const surveyGetOne = async (surveyId: string) => await $http.get(`/surveys/${surveyId}`);
export const surveyDelete = async (surveyId: string) => await $http.delete(`/surveys/${surveyId}`);
export const surveyUpdate = async (surveyId: string, data: any) => await $http.put(`/surveys/${surveyId}`, data);

// Survey Play
export const surveyNewCard = async (surveyId: string) => await $http.post(`surveys/${surveyId}/card/new`);
export const surveyNewHashtag = async (surveyId: string) => await $http.post(`surveys/${surveyId}/hashtag/new`);
export const surveyAddLeftSwipedCard = async (surveyId: string, data: any) => await $http.post(`surveys/${surveyId}/card/add-left-swiped-card`, data);
export const surveyAddRightSwipedCard = async (surveyId: string, data: any) => await $http.post(`surveys/${surveyId}/card/add-right-swiped-card`, data);
export const surveyUpdateRightSwipedCards = async (surveyId: string, data: any) => await $http.put(`surveys/${surveyId}/card/update-right-swiped-cards`, data);
export const surveyAddLeftSwipedHashtag = async (surveyId: string, data: any) => await $http.post(`surveys/${surveyId}/hashtag/add-left-swiped-hashtag`, data);
export const surveyAddRightSwipedHashtag = async (surveyId: string, data: any) => await $http.post(`surveys/${surveyId}/hashtag/add-right-swiped-hashtag`, data);

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
