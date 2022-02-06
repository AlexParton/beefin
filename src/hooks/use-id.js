import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import MyFirebase from "../database/firebase";

const app = MyFirebase();
const useId = (hash) => {
    const db = getDatabase(app);
   
    const usersDbRef = ref(db, `users`);

    const [userId, setUserId] = useState('')

    useEffect(() => {
        if (!!usersDbRef) {
            onValue(usersDbRef, (snapshot) => {
                const snap = snapshot.val();
                const array = Object.entries(snap);
                const item = array.find(user => user[1].hash === hash);
                setUserId(item[1].userId)
            });
        }

        return () => {}
    }, [userId]);

    return userId
}

export default useId;