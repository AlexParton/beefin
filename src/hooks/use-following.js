import { doc, getFirestore, getDoc, setDoc, updateDoc} from "firebase/firestore";
import MyFirebase from "../database/firebase";

const app = MyFirebase();

const useFollowing = () => {
   
    
    const doFollow = (followedId, followingId, followedHash, followingHash) => {
       
        const db = getFirestore(app);
        const followingDbRef = doc(db, 'users', followingId);
        const followedDbRef = doc(db, 'users', followedId);
        getDoc(followingDbRef)
        .then((docSnap) => {
            const updatedFollowing = [...docSnap.data().following, followedId];
            updateDoc(followingDbRef, {following: updatedFollowing})
        })

        getDoc(followedDbRef)
        .then((docSnap) => {
            const updatedFollowed = [...docSnap.data().followedBy, followingId];
            updateDoc(followedDbRef, {followedBy: updatedFollowed})
        })

       
        const now = Date.now();
        const noti = {};
        const notiId = 'not' + now;
        noti[notiId] = {
            from: {
                date:now,
                userHash: followingHash,
                userId: followingId
            },
            notificationId: notiId,
            seen: false,
            type: 'follow',
            what: followedId
        }
        const notiRef = doc(db, 'notifications', followedId);
        getDoc(notiRef)
         .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                updateDoc(notiRef, noti);
            } else {
                setDoc(doc(db, 'notifications', followedId), noti)  
            }
         })
       
    }

    const doUnfollow = (followedId, followingId) => {
        const db = getFirestore(app);
        const followingDbRef = doc(db, 'users', followingId);
        const followedDbRef = doc(db, 'users', followedId);

        getDoc(followingDbRef)
        .then((docSnap) => {
            const updatedFollowing = docSnap.data().following.filter((snap) => snap !== followedId)
            updateDoc(followingDbRef, {following: updatedFollowing})
        })

        getDoc(followedDbRef)
        .then((docSnap) => {
            const updatedFollowed = docSnap.data().following.filter((snap) => snap !== followingId)
            updateDoc(followedDbRef, {followedBy: updatedFollowed})
        })
   }

    return {follow: doFollow, unfollow: doUnfollow};
};

export default useFollowing;