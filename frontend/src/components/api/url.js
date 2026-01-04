
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://urlshortner-12.onrender.com/api/v1',
  withCredentials: true,
});