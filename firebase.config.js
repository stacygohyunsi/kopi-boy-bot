module.exports = {
  development: {
		apiKey: "AIzaSyAr-GmcfRJkiiOYau8zlUQYXTs8lBqGCiw",
		authDomain: "kopiboyapp-6a596.firebaseapp.com",
		databaseURL: "https://kopiboyapp-6a596.firebaseio.com",
		storageBucket: "kopiboyapp-6a596.appspot.com"
  },
  production: {
    apiKey: process.env.firebase_api_key,
    authDomain: process.env.firebase_auth_domain,
    databaseURL: process.env.firebase_database_URL, 
		storageBucket: process.env.firebase_storage_bucket
  },
}