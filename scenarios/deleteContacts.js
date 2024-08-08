import { check, sleep } from 'k6';
import { config } from '../config/config.js'
import { getContact, getContactList} from '../utils/httpUtilGet.js'
import {deleteContact} from '../utils/contactOperations.js'
import { initializeSetup, validateData} from '../utils/scenarioUtils.js'

export let options = { 
    //vus: 3, 
    //iterations: 10, 
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
  
    const contactList = getContactList(baseURL, token);
    //console.log('Contact list: ', contactList);
    if (contactList.length === 0) {
      console.log('No contacts available to update.');
      return;
    }
    if (contactList.length <= 1) {
        console.log('Not enough contacts to delete.');
        return; 
    }
  
    const randomIndex = Math.floor(Math.random() * contactList.length);
    const contactToDelete = contactList[randomIndex];

    getContact(baseURL, token, contactToDelete._id);
    console.log('Contact to be deleted: ', contactToDelete._id);

    const contactDeleted = deleteContact(baseURL, token, contactToDelete._id);
    if (!contactDeleted) {
      console.error('Failed to delete contact');
      return;
    }

    const updatedContactList = getContactList(baseURL, token);
    const contactStillExists = updatedContactList.some(contact => contact._id === contactToDelete._id);

    check(contactStillExists, {
      'contact is deleted': (exists) => !exists,
    });
  
    sleep(1);
}
  