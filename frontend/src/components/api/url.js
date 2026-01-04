
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://urlshortner-id47.onrender.com/api/v1',
  withCredentials: true,
});