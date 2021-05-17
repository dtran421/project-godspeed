import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// Initializing the cors middleware
export const headersConfig = {
	headers: {
		"Content-Type": "application/json",
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
		"sec-fetch-dest": "none",
		accept: "*/*",
		"sec-fetch-site": "cross-site",
		"sec-fetch-mode": "cors",
		"accept-language": "en-US"
	}
};

const firebaseConfig = {
	apiKey: "AIzaSyD7Nmcz7MRdpwlMPz3GNxDdmB1GEgK0zck",
	authDomain: "project-godspeed-0421.firebaseapp.com",
	projectId: "project-godspeed-0421",
	storageBucket: "project-godspeed-0421.appspot.com",
	messagingSenderId: "213992445187",
	appId: "1:213992445187:web:1a570ed1d6ea5574e70536"
};

let app;
if (!firebase.apps.length) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}
const db = firebase.firestore(app);

export { firebase, db };

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider attribute="class">
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
