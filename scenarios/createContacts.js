import { check, sleep } from 'k6';
import { config } from '../config/config.js'
import { createContact } from '../utils/httpUtilPost.js';
import {getUserProfile, getContact} from '../utils/httpUtilGet.js'
import { initializeSetup, validateData, finishLogout} from '../utils/scenarioUtils.js'
import { generateContacts } from '../utils/generateContactData.js';

export let options = { 
  thresholds: {
    'http_req_duration': ['p(95)<2000'], 
    'http_req_failed': ['rate<0.1'], 
  },
};

export function setup() {
  return initializeSetup();
}

export default function (data) {
  const { baseURL, token } = validateData(data);

  getUserProfile(baseURL, token);

  const numContacts = 2;
  const contacts = generateContacts(numContacts);

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

  finishLogout(baseURL, token);

  sleep(1);
}