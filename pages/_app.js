import "../styles/globals.css";
import firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyD7Nmcz7MRdpwlMPz3GNxDdmB1GEgK0zck",
	authDomain: "project-godspeed-0421.firebaseapp.com",
	projectId: "project-godspeed-0421",
	storageBucket: "project-godspeed-0421.appspot.com",
	messagingSenderId: "213992445187",
	appId: "1:213992445187:web:1a570ed1d6ea5574e70536"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app();
}

export { firebase };

function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

export default MyApp;
