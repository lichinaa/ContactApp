import { check, sleep } from 'k6';
import { config } from '../config/config.js';
import { login, createContact, logout } from '../utils/httpUtilPost.js';
import {getUserProfile, getContact} from '../utils/httpUtilGet.js'

export let options = { 
  thresholds: {
    'http_req_duration': ['p(95)<2000'], 
    'http_req_failed': ['rate<0.1'], 
  },
};

const contacts = JSON.parse(open('../data/contactData.json'));


export function setup() {
  const baseURL = config.baseURL;
  const username = config.username;
  const password = config.password;

  const token = login(baseURL, username, password);

  if (!token) {
      throw new Error('Failed to login and retrieve token');
  }

  return { baseURL, token };
}

export default function (data) {

  const { baseURL, token } = data;

  if (!baseURL || !token) {
    throw new Error('baseURL or token not initialized');
  }
  
  getUserProfile(baseURL, token);

  contacts.forEach(contact => {
    const createdContact = createContact(baseURL, token, contact);
    const retrievedContact = getContact(baseURL, token, createdContact._id);
  
    check(retrievedContact, {
      'contact data matches': (retrievedContact) =>
        retrievedContact.firstName === contact.firstName &&
        retrievedContact.lastName === contact.lastName &&
        retrievedContact.email === contact.email,
    });
  });

  logout(baseURL, token);

  sleep(1);
}