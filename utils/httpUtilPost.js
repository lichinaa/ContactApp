import http from 'k6/http';
import { check } from 'k6';
import { config } from '../config/config.js';

export function login(baseURL, username, password) {
  const res = http.post(`${baseURL}/users/login`, JSON.stringify({
      email: username,
      password: password,
  }), {
      headers: {
          'Content-Type': 'application/json',
      },
  });

  check(res, {
      'login successful': (r) => r.status === 200,
  });

  //console.log(`Response Status: ${res.status}`);
  //console.log(`Response Body: ${res.body}`);

  if (res.status === 200) {
      return res.json().token;
  } else {
      console.log(`Login failed for user: ${username}`);
      return null;
  }
}

export function createUser(email, password, token) {
  const url = `${config.baseURL}/users`;
  const payload = JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: email,
      password: password
  });

  const params = {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  };

  const response = http.post(url, payload, params);
  check(response, {
      'is status 201': (r) => r.status === 201,
  });
  return JSON.parse(response.body); 
}
export function createContact(baseURL, token, contact) {
  const res = http.post(`${baseURL}/contacts`, JSON.stringify(contact), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  //console.log(`Create Contact Response Status: ${res.status}`);
  //console.log(`Create Contact Response Body: ${res.body}`);

  check(res, {
    'contact created': (r) => r.status === 201,
  });

  return JSON.parse(res.body);
}

export function logout(baseURL, token) {
  const url = `${baseURL}/users/logout`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = http.post(url, null, params);

  check(response, { 'logout successful': (r) => r.status === 200 });
}
