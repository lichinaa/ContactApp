import { check, sleep } from 'k6';
import { config } from '../config/config.js'
import { getContact, getContactList} from '../utils/httpUtilGet.js'
import {updateContact} from '../utils/contactOperations.js'
import { initializeSetup, validateData} from '../utils/scenarioUtils.js'

export const options = { 
    thresholds: {
      http_req_failed: ['rate<0.01'], 
      http_req_duration: ['p(95) < 850', 'p(99.9) < 2000'],
    },
  };


  export function setup() {
    return initializeSetup();
  }
  
  export default function (data) {
  const { baseURL, token } = validateData(data);

  const contactList = getContactList(baseURL, token);
  if (contactList.length === 0) {
    console.log('No contacts available to update.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * contactList.length);
  const contactToUpdate = contactList[randomIndex];
  
  const updateFields = { firstName: 'First name updated' };
  const updatedContact = updateContact(baseURL, token, contactToUpdate._id, updateFields);

  const retrievedContact = getContact(baseURL, token, updatedContact._id);

  check(retrievedContact, {
    'contact updated': (contact) =>
      contact.firstName === 'First name updated',
  });

  sleep(1);
}
