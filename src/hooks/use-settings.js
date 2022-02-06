import { useEffect, useState } from 'react';
import { doc, onSnapshot, getFirestore, updateDoc} from "firebase/firestore";
import MyFirebase from "../database/firebase";

const app = MyFirebase();

const useSettings = (id) => {
    const [darkModeActive, setDarkModeActive] = useState(false);
    const [hideFollowedActive, setHideFollowedActive] = useState(false);
    let userSettingsRef = null;
    if (id) {
        const db = getFirestore(app);
        userSettingsRef = doc(db, "usersettings", id);
    }

    const updateSetting = (setting, newStatus) => {
        const post = {};
        post[setting] = newStatus;
        updateDoc(userSettingsRef, post);
    }
   

    useEffect(() => {
        if (id) {
            const unsub = onSnapshot(userSettingsRef, (doc) => {
                setDarkModeActive(doc.data().darkmode);         
                setHideFollowedActive(doc.data().hidefollowed);         
    
            })
        }
       
    }, [darkModeActive, hideFollowedActive])

    if (!id) {
        return {darkModeActive: false, hideFollowedActive: false, updateSetting: null}
    }

    return {darkModeActive: darkModeActive, hideFollowedActive: hideFollowedActive, updateSetting: updateSetting};
};

export default useSettings;