import { Account, Client, Databases } from "appwrite";

export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
export const DATABASE_ID= import.meta.env.VITE_DATABASE_ID
export const COLLECTION_ID_MESSAGE = import.meta.env.VITE_COLLECTION_ID_MESSAGE
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_PROJECT_ID);

export const database = new Databases(client)
export const account = new Account(client)
export default client