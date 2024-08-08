import { login, logout } from '../utils/httpUtilPost.js';
import { config } from '../config/config.js';

export function initializeSetup () {
  const baseURL = config.baseURL;
  const username = config.username;
  const password = config.password;

  const token = login(baseURL, username, password);
  if (!token) {
    throw new Error('Failed to login and retrieve token');
  }

  return { baseURL, token };
}

export function validateData(data) {
    const { baseURL, token } = data;
    
    if (!baseURL || !token) {
      throw new Error('baseURL or token not initialized');
    }
    
    return { baseURL, token };
}

export function finishLogout(baseURL, token) {
  logout(baseURL, token);
}
