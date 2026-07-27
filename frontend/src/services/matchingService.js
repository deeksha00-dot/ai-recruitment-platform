import api from './api';

const matchingService = {
  async getMatchesForCandidate(candidateId) {
    const { data } = await api.get(`/matching/candidate/${candidateId}`);
    return data;
  },

  async getMatchesForJob(jobId) {
    const { data } = await api.get(`/matching/job/${jobId}`);
    return data;
  },

  async getMatchDetail(jobId, candidateId) {
    const { data } = await api.get(`/matching/job/${jobId}/candidate/${candidateId}`);
    return data;
  },

  async runMatching(jobId) {
    const { data } = await api.post(`/matching/job/${jobId}/run`);
    return data;
  },
};

export default matchingService;
