import { onSnapshot, getFirestore, doc,} from "firebase/firestore";
import MyFirebase from "../database/firebase";
import { useState, useEffect } from "react";
const app = MyFirebase();

const useGetvotes = (isPrincipal, principalId, id) => {

    const [votes, setVotes] = useState(0);
   
    const db = getFirestore(app);

    useEffect(() => {
      
            if (isPrincipal) {
                const unsub = onSnapshot(doc(db, "beefbook", id), (doc) => {
                    if (doc.exists()) {
                        if (doc.data()) {
                            setVotes(doc.data().votedBy.length)
                           } 
                    }                  
                 })
            }
    
            if (!isPrincipal) {
                const unsub = onSnapshot(doc(db, "beefbook", principalId), (doc) => {
                    if (doc.exists()) {
                        if (doc.data()) {
                            const answer = doc.data().answers.filter((answer) => answer.beefId === id)
                            setVotes(answer[0].votedBy.length)
                        } 
                    }
                 })
            }
       
       
       
       return () => {}
       
    }, [id])

    return votes;
};

export default useGetvotes;