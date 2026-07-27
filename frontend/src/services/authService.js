import api from './api';

const authService = {
  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register({ name, email, password, role }) {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.put('/auth/me', payload);
    return data;
  },

  async changePassword(payload) {
    const { data } = await api.post('/auth/change-password', payload);
    return data;
  },

  logout() {
    // Server-side session/token invalidation could be triggered here if supported.
    return true;
  },
};

export default authService;
