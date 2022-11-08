import $http from "./xhr";

export const authLogin = async (data: any) => await $http.post("/auth/login", data);

export const cardGetAll = async () => await $http.get(`/cards/`);
export const cardCreate = async (data: any) => await $http.post(`/cards/`, data);
export const cardGetOne = async (cardId: string) => await $http.get(`/cards/${cardId}`);
export const cardUpdate = async (cardId: string, data: any) => await $http.put(`/cards/${cardId}`, data);
export const cardDelete = async (cardId: string) => await $http.delete(`/cards/${cardId}`);

export const hashtagGetAll = async () => await $http.get(`/hashtags/`);
export const hashtagGetAllTitles = async () => await $http.get(`/hashtags/titles`);
export const hashtagCreate = async (data: any) => await $http.post(`/hashtags/`, data);
export const hashtagGetOne = async (hashtagId: string) => await $http.get(`/hashtags/${hashtagId}`);
export const hashtagUpdate = async (hashtagId: string, data: any) => await $http.put(`/hashtags/${hashtagId}`, data);
export const hashtagDelete = async (hashtagId: string) => await $http.delete(`/hashtags/${hashtagId}`);

export const organisationGetAll = async () => await $http.get(`/organisations/`);
export const organisationCreate = async (data: any) => await $http.post(`/organisations/`, data);
export const organisationGetOneBySlug = async (slug: string) => await $http.get(`/organisations/slug/${slug}`);
export const organisationGetOne = async (organisationId: string) => await $http.get(`/organisations/${organisationId}`);
export const organisationUpdate = async (organisationId: string, data: any) => await $http.put(`/organisations/${organisationId}`, data);
export const organisationDelete = async (organisationId: string) => await $http.delete(`/organisations/${organisationId}`);

export const projectGetAll = async () => await $http.get(`/projects/`);
export const projectGetAllByOrganisation = async (organisationId: string) => await $http.get(`/projects/organisation/${organisationId}`);
export const projectGetAllForUser = async () => await $http.get(`/projects/user/`);
export const projectCreate = async (data: any) => await $http.post(`/projects/`, data);
export const projectGetOne = async (projectId: string) => await $http.get(`/projects/${projectId}`);
export const projectUpdate = async (projectId: string, data: any) => await $http.put(`/projects/${projectId}`, data);
export const projectDelete = async (projectId: string) => await $http.delete(`/projects/${projectId}`);

export const surveyGetAll = async () => await $http.get(`/surveys/`);
export const surveyGetAllByOrganisation = async (organisationId: string) => await $http.get(`/surveys/organisation/${organisationId}`);
export const surveyCreate = async (data: any) => await $http.post(`/surveys/`, data);
export const surveyGetOne = async (surveyId: string) => await $http.get(`/surveys/${surveyId}`);
export const surveyGetNewCard = async (surveyId: string) => await $http.get(`surveys/${surveyId}/card/new`);
export const surveyGetNewHashtag = async (surveyId: string) => await $http.get(`surveys/${surveyId}/hashtag/new`);
export const surveyUpdate = async (surveyId: string, data: any) => await $http.put(`/surveys/${surveyId}`, data);
export const surveyDelete = async (surveyId: string) => await $http.delete(`/surveys/${surveyId}`);
export const surveyUpdateLeftSwipedCardRefs = async (surveyId: string, data: any) => await $http.patch(`surveys/${surveyId}/card/left-swiped`, data);
export const surveyUpdateRightSwipedCardRefs = async (surveyId: string, data: any) => await $http.patch(`surveys/${surveyId}/card/right-swiped`, data);
export const surveyUpdateLeftSwipedHashtagRefs = async (surveyId: string, data: any) => await $http.patch(`surveys/${surveyId}/hashtag/left-swiped`, data);
export const surveyUpdateRightSwipedHashtagRefs = async (surveyId: string, data: any) => await $http.patch(`surveys/${surveyId}/hashtag/right-swiped`, data);

export const userGetAll = async () => await $http.get(`/users/`);
export const userGetAllByOrganisation = async (organisationId: string) => await $http.get(`/users/organisation/${organisationId}`);
export const userGetMe = async () => await $http.get(`/users/me`);
export const userCreate = async (data: any) => await $http.post(`/users/`, data);
export const userGetOne = async (userId: string) => await $http.get(`/users/${userId}`);
export const userUpdate = async (userId: string, data: any) => await $http.put(`/users/${userId}`, data);
export const userDelete = async (userId: string) => await $http.delete(`/users/${userId}`);

// export const demoGetAll = async () => await $http.get(`/demos/`);
// export const demoCreate = async (data: any) => await $http.post(`/demos/`, data);
// export const demoGetOne = async (demoId: string) => await $http.get(`/demos/${demoId}`);
// export const demoUpdate = async (demoId: string, data: any) => await $http.put(`/demos/${demoId}`, data);
