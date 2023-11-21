import axios from 'axios';

import { QY_API_URL } from '../config/constants';

const request = axios.create({
  baseURL: QY_API_URL,
  timeout: 5000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default request;
