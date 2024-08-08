import http from 'k6/http';
import { check } from 'k6';
import { config } from '../config/config.js';

export function getUserProfile(baseURL, token) {
  const url = `${baseURL}/users/me`;
  const params = { headers: { Authorization: `Bearer ${token}` } };
  const response = http.get(url, params);

  check(response, { 'user profile': (r) => r.status === 200 });
  if (response.status !== 200) {
    console.error('Login failed:', response.body);
    return null;
  }
}

export function getContact(baseURL, token, contactId) {
  const res = http.get(`${baseURL}/contacts/${contactId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

 // console.log(`Get Contact Response Status: ${res.status}`);
 // console.log(`Get Contact Response Body: ${res.body}`);

  check(res, { 'contact check': (r) => r.status === 200 });

  return JSON.parse(res.body);
}

export function getContactList(baseURL, token) {
    const url = `${baseURL}/contacts`;
    const params = { headers: { Authorization: `Bearer ${token}` } };
    const response = http.get(url, params);
  
    check(response, { 'contact list': (r) => r.status === 200 });

    if (response.status === 200) {
      return JSON.parse(response.body);
  } else {
      console.error('Failed to get contact list');
      return [];
  }
}

