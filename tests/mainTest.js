import { check, sleep } from 'k6';
import { config } from '../config/config.js';
import { login, createContact, logout } from '../utils/httpUtilPost.js';
import { getUserProfile, getContact } from '../utils/httpUtilGet.js';
import {updateContact} from '../utils/contactOperations.js'
import { generateContacts } from '../utils/generateContactData.js';

export let options = {
  vus: 3,
  duration: '10s',
  //iterations: 4,
  thresholds: {
    'http_req_duration': ['p(95)<2000'],
    'http_req_failed': ['rate<0.1'],
  },
};

const usersData = JSON.parse(open('../data/usersData.json')); 

export function setup() {
  const baseURL = config.baseURL;
  return { baseURL };
}

export default function (data) {
  const { baseURL } = data;
  const userIndex = (__VU - 1) % usersData.length;
  const user = usersData[userIndex];

  const { username, password } = user;
  const token = login(baseURL, username, password);
  console.log('USERNAME LOGIN:', username);

  if (!token) {
    throw new Error('Failed to login and retrieve token for user ' + username);
  }

  getUserProfile(baseURL, token);
  
  const numContacts = 2;
  const contacts = generateContacts(numContacts);

  contacts.forEach(contact => {
    const createdContact = createContact(baseURL, token, contact);
    console.log('USERNAME CREATE CONTACT:', username);
    //console.log('Created contact', contact);

    const retrievedContact = getContact(baseURL, token, createdContact._id);

    check(retrievedContact, {
      'contact data matches': (retrievedContact) =>
        retrievedContact.firstName === contact.firstName &&
        retrievedContact.lastName === contact.lastName &&
        retrievedContact.email === contact.email,
    });

    const updateFields = { firstName: 'First name updated' };
    const updatedContact = updateContact(baseURL, token, createdContact._id, updateFields);
    //console.log('USERNAME UPDATE CONTACT:', username);

    const retrievedUpdatedContact = getContact(baseURL, token, updatedContact._id);

    check(retrievedUpdatedContact, {
      'contact updated': (contact) =>
        contact.firstName === 'First name updated',
    });
  });

  logout(baseURL, token);
  console.log('USERNAME LOGOUT:', username);

  sleep(1);
}
