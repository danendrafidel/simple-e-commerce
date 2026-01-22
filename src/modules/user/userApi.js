import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export function getCurrentCustomerUser(userId) {
  return axios.get(`${API_BASE}/users/${userId}`).then((r) => r.data);
}

export function listPackages() {
  return axios.get(`${API_BASE}/packages`).then((r) => r.data);
}

export function listTransactionsByCustomer(customerId) {
  return axios
    .get(`${API_BASE}/transactions`, { params: { customerId } })
    .then((r) => r.data);
}

export function createTransaction(payload) {
  return axios.post(`${API_BASE}/transactions`, payload).then((r) => r.data);
}

export function patchUser(userId, payload) {
  return axios.patch(`${API_BASE}/users/${userId}`, payload).then((r) => r.data);
}

export function createTopup(payload) {
  return axios.post(`${API_BASE}/topups`, payload).then((r) => r.data);
}

