const firebase = require('firebase');
const firebaseConfig = require('./firebase.config');
var firebaseSingleton = null;


function FirebaseDatabase(path) {
	if(firebaseSingleton === null) {
		firebaseSingleton = {};
		firebase.initializeApp(firebaseConfig);
		// firebase.database.enableLogging(true);
		firebaseSingleton._ = firebase.database();
	}
	firebaseSingleton[path] = firebaseSingleton[path] || firebaseSingleton._.ref(path);
	return firebaseSingleton[path];
}

module.exports = FirebaseDatabase;