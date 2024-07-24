import { check, sleep } from 'k6';
import { config } from '../config/config.js';
import { login } from '../utils/httpUtilPost.js';
import { getContact, getContactList} from '../utils/httpUtilGet.js'
import {deleteContact} from '../utils/httpUtil.js'


export let options = { 
    //vus: 3, 
    //iterations: 10, 
    thresholds: {
      'http_req_duration': ['p(95)<2000'], 
      'http_req_failed': ['rate<0.1'], 
    },
  };

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
  
    const contactList = getContactList(baseURL, token);
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
    
    const contactDeleted = deleteContact(baseURL, token, contactToDelete._id);
  if (!contactDeleted) {
    console.error('Failed to delete contact');
    return;
  }

  // Step 4: Get contact list to verify deletion
  const updatedContactList = getContactList(baseURL, token);
  const contactStillExists = updatedContactList.some(contact => contact._id === contactToDelete._id);

  // Check if the contact has been successfully deleted
  check(contactStillExists, {
    'contact is deleted': (exists) => !exists,
  });
  
    sleep(1);
}
  