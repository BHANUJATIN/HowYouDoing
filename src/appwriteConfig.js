import { Client, Databases, Account} from 'appwrite';

export const PROJECT_ID = '649bd418a7e6d8977b98';
export const DATABASE_ID = '649bd912ceada18de676';
export const COLLECTION_ID_MESSAGES = '649bd94ed62fc43540b0';

const client = new Client();

export const account = new Account(client);
export const databases = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('649bd418a7e6d8977b98');

export default client