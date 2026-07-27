import api from './api';

const jobService = {
  async getJobs(params = {}) {
    const { data } = await api.get('/jobs', { params });
    return data;
  },

  async getJobById(id) {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  async createJob(payload) {
    const { data } = await api.post('/jobs', payload);
    return data;
  },

  async updateJob(id, payload) {
    const { data } = await api.put(`/jobs/${id}`, payload);
    return data;
  },

  async deleteJob(id) {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },

  async getApplicants(jobId, params = {}) {
    const { data } = await api.get(`/jobs/${jobId}/applicants`, { params });
    return data;
  },

  async applyToJob(jobId, payload = {}) {
    const { data } = await api.post(`/jobs/${jobId}/apply`, payload);
    return data;
  },

  async getMyApplications() {
    const { data } = await api.get('/jobs/my-applications');
    return data;
  },

  async updateApplicationStatus(jobId, applicationId, status) {
    const { data } = await api.patch(`/jobs/${jobId}/applicants/${applicationId}`, { status });
    return data;
  },
};

export default jobService;
