
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://uri-shortner-fawn.vercel.app/api/v1',
  withCredentials: true,
});