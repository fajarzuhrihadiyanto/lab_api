const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILE_PATH,
    databaseId: process.env.DATABASE_NAME,
    ignoreUndefinedProperties: true
});

module.exports = db