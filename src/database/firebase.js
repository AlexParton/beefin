import { initializeApp } from 'firebase/app';

const MyFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDZC-mAa9MBRpeDSQeTj4zE-k4WX2OpRN8",
        authDomain: "beefin-b940a.firebaseapp.com",
        databaseURL: "https://beefin-b940a-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "beefin-b940a",
        storageBucket: "beefin-b940a.appspot.com",
        messagingSenderId: "79012311335",
        appId: "1:79012311335:web:01da5f3aed4a1b49bcf902",
        measurementId: "G-T24ZH4EV0R"
      };    
      
    return initializeApp(firebaseConfig);
}

  export default MyFirebase;