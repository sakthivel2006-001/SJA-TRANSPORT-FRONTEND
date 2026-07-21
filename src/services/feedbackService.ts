import api from './api';

export const getFeedback = () => api.get('/feedback');
export const getPublicFeedback = () => api.get('/feedback/public');
