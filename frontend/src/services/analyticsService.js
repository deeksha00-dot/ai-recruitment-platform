import api from './api';

const analyticsService = {
  async getOverview() {
    const { data } = await api.get('/analytics/overview');
    return data;
  },

  async getApplicationsPerDay(range = '30d') {
    const { data } = await api.get('/analytics/applications-per-day', { params: { range } });
    return data;
  },

  async getTopSkills() {
    const { data } = await api.get('/analytics/top-skills');
    return data;
  },

  async getHiringFunnel() {
    const { data } = await api.get('/analytics/hiring-funnel');
    return data;
  },

  async getTopCandidates(jobId) {
    const { data } = await api.get('/analytics/top-candidates', { params: { job_id: jobId } });
    return data;
  },
};

export default analyticsService;
