import api from './api';

const candidateService = {
  async getCandidates(params = {}) {
    const { data } = await api.get('/candidates', { params });
    return data;
  },

  async getCandidateById(id) {
    const { data } = await api.get(`/candidates/${id}`);
    return data;
  },

  async getMyProfile() {
    const { data } = await api.get('/candidates/me');
    return data;
  },

  async updateMyProfile(payload) {
    const { data } = await api.put('/candidates/me', payload);
    return data;
  },

  async uploadResume(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/candidates/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onUploadProgress && evt.total) {
          onUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    });
    return data;
  },

  async getResumePreviewUrl(id) {
    const { data } = await api.get(`/candidates/${id}/resume/preview`);
    return data;
  },

  async getMyApplications() {
    const { data } = await api.get('/candidates/me/applications');
    return data;
  },

  async searchCandidates(query, filters = {}) {
    const { data } = await api.get('/candidates/search', { params: { q: query, ...filters } });
    return data;
  },
};

export default candidateService;
