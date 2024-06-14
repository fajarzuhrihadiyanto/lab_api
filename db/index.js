const Firestore = require('@google-cloud/firestore');
const { credential } = require('firebase-admin');

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY
    },
    databaseId: process.env.DATABASE_NAME,
    ignoreUndefinedProperties: true
});

module.exports = db