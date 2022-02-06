import { useEffect, useState } from "react";
import { doc, getFirestore, getDoc } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";

const app = MyFirebase();
const useHash = (id) => {
    const [hash, setHash] = useState('')
    const getHash = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, "users", id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            setHash(docSnap.data().hash);
        }
    }

    useEffect(() => {
        if (id) {
            getHash();
        }
     

    }, [id]);

    return hash
}

export default useHash;