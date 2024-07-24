import http from 'k6/http';
import { check } from 'k6';

export function deleteContact(baseURL, token, contactId) {
    const url = `${baseURL}/contacts/${contactId}`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = http.del(url, null, params);
  
    check(response, { 'contact deleted': (r) => r.status === 200 || r.status === 204 });
    return response.status === 200 || response.status === 204;
}

export function updateContact(baseURL, token, contactId, updateFields) {
  const url = `${baseURL}/contacts/${contactId}`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const payload = JSON.stringify(updateFields);
  const response = http.patch(url, payload, params);

  check(response, { 'updated contact': (r) => r.status === 200 });
  
  if (response.status === 200) {
    return JSON.parse(response.body);
  } else {
    console.error('Failed to update contact');
    return null;
  }

}