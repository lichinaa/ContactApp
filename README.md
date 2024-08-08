# ContactApp
Performance testing for a contact management app using [k6](https://k6.io/). Tests include adding, updating, and deleting contacts.

## API Documentation

Refer to the [API documentation](https://documenter.getpostman.com/view/4012288/TzK2bEa8#3ec4f31e-3ce0-4edf-9f3a-e3ec6461e4e6) for endpoint details.

## Precondition

- User must be signed up and have valid credentials.

## Scenarios

1. **Add New Contact**: Log in, add contact, check creation.
2. **Update Contact**: Log in, get contact list, select and update contact, check update.
3. **Delete Contact**: Log in, delete contact, check deletion.

## Project Structure

- **`config/`**: Configuration files
- **`data/`**: Test data files
- **`utils/`**: HTTP request utilities
- **`scenarios/`**: Test scenarios
- **`mainTest.js`**: Main test script

## Installation

1. Clone the repository:
   git clone https://github.com/lichinaa/ContactApp.git
2. Navigate to the directory and install dependencies:
   cd ContactApp
   npm install 
3. Configuration
   Ensure your configuration file in config/ is set up correctly. Check the config.js file for proper settings such as API base URL and credentials.    

## Running Tests
  k6 run path/to/mainTest.js
