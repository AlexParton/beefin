import { useEffect, useState } from 'react';
import { doc, onSnapshot, getFirestore} from "firebase/firestore";
import MyFirebase from "../database/firebase";

const app = MyFirebase();

const useNotification = () => {
    const [newNotification, setNewNotification] = useState(false);
    const [howManyNotifications, setHowManyNotifications] = useState(0);
    const db = getFirestore(app);
    const isUser = (localStorage.getItem('uid'));

    useEffect(() => {
        if (isUser) {
            const unsub = onSnapshot(doc(db, "notifications", localStorage.getItem('uid')), (doc) => {
               
                for (const key in  doc.data()) {
                    if (!doc.data()[key].seen) {
                        setNewNotification(true)
                        setHowManyNotifications(howManyNotifications + 1)
                        return
                    } else {
                        setNewNotification(false)
                    }
                }
            })
        }

    }, [localStorage.getItem('uid')])

    return {newNotification: newNotification, howManyNotifications: howManyNotifications};

};

export default useNotification;