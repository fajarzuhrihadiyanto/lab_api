const Firestore = require('@google-cloud/firestore');

const base64EncodedServiceAccount = process.env.CREDENTIALS;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    credentials,
    databaseId: process.env.DATABASE_NAME,
    ignoreUndefinedProperties: true
});

module.exports = db