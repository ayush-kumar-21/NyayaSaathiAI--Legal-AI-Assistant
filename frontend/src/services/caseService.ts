import { api } from '../lib/api';
import { Case } from '../types/index';

export const caseService = {
  // Citizen API
  createCase: async (payload: any): Promise<Case> => {
    return await api.post('/citizen/cases/file', payload);
  },

  getMyCases: async (): Promise<Case[]> => {
    return await api.get('/citizen/cases/my-cases');
  },

  trackCase: async (cnr: string): Promise<Case> => {
    return await api.get(`/citizen/cases/track/${encodeURIComponent(cnr)}`);
  },

  // Police API
  getAssignedCases: async (): Promise<Case[]> => {
    return await api.get('/police/cases/assigned');
  },

  // Judge API
  getAllCases: async (): Promise<Case[]> => {
    return await api.get('/judge/cases/pending');
  }
};
