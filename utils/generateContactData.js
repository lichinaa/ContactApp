const firstNames = ["John", "Jane", "Alex", "Chris", "Pat"];
const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Davis"];
const defaultOwnerId = "6085a21efcfc72405667c3d4";

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function generateRandomNameIndices() {
  return {
    firstNameIndex: getRandomIndex(firstNames),
    lastNameIndex: getRandomIndex(lastNames),
  };
}

export function generateContacts(numContacts) {
    const contacts = [];
    for (let i = 0; i < numContacts; i++) {
      contacts.push(generateContactData());
    }
    return contacts;
  }

export function generateContactData() {
  const { firstNameIndex, lastNameIndex } = generateRandomNameIndices();
  return {
    firstName: firstNames[firstNameIndex],
    lastName: lastNames[lastNameIndex],
    birthdate: "1970-01-01",
    email: `${firstNames[firstNameIndex].toLowerCase()}${lastNames[lastNameIndex].toLowerCase()}@fake.com`,
    phone: "8005555555",
    street1: "1 Main St.",
    street2: "Apartment A",
    city: "Anytown",
    stateProvince: "KS",
    postalCode: "12345",
    country: "USA",
    owner: defaultOwnerId,
    "__v": 0
  };
}
