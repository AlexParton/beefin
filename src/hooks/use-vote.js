import { useEffect, useState } from 'react';
import { doc, onSnapshot, getFirestore} from "firebase/firestore";
import MyFirebase from "../database/firebase";

const app = MyFirebase();

const useVote = (isPrincipal, beefId, principalId) => {
    if (isPrincipal === undefined) {
        isPrincipal = false
    }
    const [isVoted, setisVoted] = useState(false);
    const db = getFirestore(app);
    useEffect(() => {
            if (!!isPrincipal) {
                const unsub = onSnapshot(doc(db, "beefbook", beefId), (doc) => {      
                    if (doc.exists()) {
                        const docReference = doc.data()
                        if (docReference !== undefined) {
                            if (docReference.votedBy.includes(localStorage.getItem('uid'))) {
                                setisVoted(true)
                                return
                            } else {
                                setisVoted(false)
                            }
                        }
                    }   
                })
            } else {
                const unsub = onSnapshot(doc(db, "beefbook", principalId), (doc) => { 
                    if (doc.exists()) { 
                        const docReference = doc.data().answers.filter((answer) => answer.beefId === beefId)[0];
                        if (docReference !== undefined) {
                            if (docReference.votedBy.includes(localStorage.getItem('uid'))) {
                                setisVoted(true)
                                return
                            } else {
                                setisVoted(false)
                            }
                        }
                        
                    }
                   
                })  
            }
       
        
       
    }, [isPrincipal, beefId, principalId])

    return isVoted;
};

export default useVote;