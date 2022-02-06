import { useEffect, useState } from 'react';
import { doc, onSnapshot, getFirestore, getDoc, query, where, collection, updateDoc, setDoc} from "firebase/firestore";
import MyFirebase from "../database/firebase";


const app = MyFirebase();

const useVoting = () => {
  

    const handleVoting = (type, isPrincipal, beefId, principalId, beefCreatorId, voterHash) => {
       
        const theUser = localStorage.getItem('uid')
        const db = getFirestore(app);
        const userRef = doc(db, 'users', theUser);
        const notiRef = doc(db, 'notifications', beefCreatorId);

        if (type === 'vote') {
            // ADD BEEFVOTED TO USER
            getDoc(userRef)
            .then((docSnap) => {
                const updatedVoted = [...docSnap.data().beefsVoted, beefId];
                updateDoc(userRef, {beefsVoted: updatedVoted})
            })

            
            // TYPE VOTE - PRINCIPAL
            if (isPrincipal) {
                const beefRef = doc(db, 'beefbook', beefId);
                getDoc(beefRef)
                .then((docSnap) => {
                    let modificationCounter = 0;
                    //copia el array de answers, check si alguna answer tiene el userId, si lo tiene actualiza la answer, si no no hace nada.
                    const updatedAnswers = [];
                    if ( docSnap.data().answers.length > 0) {
                        docSnap.data().answers.forEach((snap) => {
                            if (snap.votedBy.includes(theUser)) {
                                const cleanedVotes = snap.votedBy.filter((vote) => vote !== theUser);
                                const updatedAnswer = {...snap, votedBy: cleanedVotes};
                                modificationCounter ++;
                                updatedAnswers.push(updatedAnswer)  
                            } else {
                                updatedAnswers.push(snap)  
                            }      
                        })
                    }
                    
                   
                    if (modificationCounter > 0) {
                        updateDoc(beefRef, {answers: updatedAnswers})
                    }
                   
                   
                    //add userId to beef voted    
                    const beefNewVotes = [...docSnap.data().votedBy, theUser]
                    updateDoc(beefRef, {votedBy: beefNewVotes})
                })
                .then(() => {
                    const now = Date.now();
                    const noti = {};
                    const notiId = 'not' + now;
                    noti[notiId] = {
                        from: {
                            date:now,
                            userHash: voterHash,
                            userId: localStorage.getItem('uid')
                        },
                        notificationId: notiId,
                        seen: false,
                        type: 'vote',
                        what: beefId
                    }
                    getDoc(notiRef)
                     .then((docSnapshot) => {
                         if (docSnapshot.exists()) {
                            updateDoc(notiRef, noti);
                         } else {
                             console.log(beefCreatorId)
                            setDoc(doc(db, 'notifications', beefCreatorId), noti)  
                         }
                     })
                   
                })
                .catch((err) => {
                    console.log(err)
                })
            }

            // TYPE VOTE - ANSWER
            if (!isPrincipal) {
                const beefRef = doc(db, 'beefbook', principalId);
                getDoc(beefRef)
                .then((docSnap) => {
                   
                    // si el principal estaba votado por el usuario, elimina su voto
                    if (docSnap.data().votedBy.includes(theUser)) {
                        const updatedVotes = docSnap.data().votedBy.filter((vote) => vote !== theUser);
                        updateDoc(beefRef, {votedBy: updatedVotes})
                    }
                    
    
                    //add vote to answer voted y si alguna otra respuesta estaba votada, elimina su voto
                    const updatedAnswers = [];
                    docSnap.data().answers.forEach((answer) => {    
                        if (answer.beefId === beefId) {
                            answer.votedBy = [...answer.votedBy, theUser];
                            updatedAnswers.push(answer)
                        } else {
                            if (answer.votedBy.includes(theUser)) {
                                answer.votedBy = answer.votedBy.filter((vote) => vote !== theUser);
                                updatedAnswers.push(answer)
                            } else {
                                updatedAnswers.push(answer)
                            }      
                        }
                       
                    })
    
                    updateDoc(beefRef, {answers: updatedAnswers})
    
    
                })
                .then(() => {
                    const now = Date.now();
                    const noti = {};
                    const notiId = 'not' + now;
                    noti[notiId] = {
                        from: {
                            date:now,
                            userHash: voterHash,
                            userId: localStorage.getItem('uid')
                        },
                        notificationId: notiId,
                        seen: false,
                        type: 'vote',
                        what: principalId
                    }
                    getDoc(notiRef)
                    .then((docSnapshot) => {
                        if (docSnapshot.exists()) {
                           updateDoc(notiRef, noti);
                        } else {
                           setDoc(doc(db, 'notifications', beefCreatorId), noti)  
                        }
                    })
                })
            }
            
        } 

        // type unvote   
        if (type === 'unvote') {
            //UNVOTE THE BEEF FROM USER DB
            getDoc(userRef)
            .then((docSnap) => {
                const updatedVoted = docSnap.data().beefsVoted.filter((snap) => snap !== beefId);
                updateDoc(userRef, {beefsVoted: updatedVoted})
            })
            //TYPE UNVOTE - PRINCIPAL
            if (isPrincipal) {
                // quita el voto del beef principal 
                const beefRef = doc(db, 'beefbook', beefId);
                getDoc(beefRef)
                .then((docSnap) => {
                    const cleanedVotes = docSnap.data().votedBy.filter((vote) => vote !== theUser);
                    updateDoc(beefRef, {votedBy: cleanedVotes})
                })
            } 
            //TYPE UNVOTE - ANSWER 
            if (!isPrincipal) {
                //quita el voto de la respuesta
                const beefRef = doc(db, 'beefbook', principalId);
                getDoc(beefRef)
                .then((docSnap) => {
                    const updatedAnswers = [];
                    docSnap.data().answers.forEach((answer) => {    
                       
                        if (answer.beefId === beefId) {
                            const cleanedVotes = answer.votedBy.filter((vote) => vote !== theUser);
                            answer.votedBy = cleanedVotes;
                            updatedAnswers.push(answer)  
                        } else {
                            updatedAnswers.push(answer)   
                        }
                        
                    })
    
                    updateDoc(beefRef, {answers: updatedAnswers})
                })
            }
        }
    }        

    return handleVoting;
};

export default useVoting;