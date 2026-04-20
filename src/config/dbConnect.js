import admin from 'firebase-admin';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

let isConnected = false

let serviceAccount;

export const connectToDb =async () => {
    if (isConnected){
        console.log('database is already connected')
        return;
    }
    try{
        if(process.env.NODE_ENV === "production") {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        }else{
            serviceAccount = require('../../serviceAccountKey.json');
        }
        admin.initializeApp({
            credential : admin.credential.cert(serviceAccount)
        })
        isConnected = true
        console.log('Database connected succesfully')
    }catch (err){
        
    }
}
export const db = () => admin.firestore();
