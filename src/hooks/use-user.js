import { useEffect, useState } from "react";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { doc, getFirestore, getDoc } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";

const app = MyFirebase();
const useUser = (id) => {
   

    const [user, setUser] = useState({userId:'', displayName:'', avatarId:'', following: [], beefsvoted:[], followedBy:[], desc:'', hash:''})
    const [avatarUrl, setAvatarUrl] = useState('');

    // const getUser = () => {
    //     if (!!id) {
    //         const storage = getStorage();
    //         const db = getFirestore(app);
    //         const userRef = doc(db, "users", id);
            
    //         getDoc(userRef)
    //           .then(response => {
               
    //                 setUser(response.data());
    //                 const avatarStorage = storageRef(storage, `avatars/${response.data().avatarId}`);
    //                 getDownloadURL(avatarStorage)
    //                   .then((url) => {
    //                     setAvatarUrl(url);
    //                   })
    //                   .catch((error) => {
    //                     // Handle any errors
    //                   }); 
                
    //           }).catch(err => {
    //               console.log(err)
    //           })
    //     }
    // }

    useEffect(() => {
      if (!!id) {
        const storage = getStorage();
        const db = getFirestore(app);
        const userRef = doc(db, "users", id);
        
        getDoc(userRef)
          .then(response => {
           
                setUser(response.data());
                const avatarStorage = storageRef(storage, `avatars/${response.data().avatarId}`);
                getDownloadURL(avatarStorage)
                  .then((url) => {
                    setAvatarUrl(url);
                  })
                  .catch((error) => {
                    // Handle any errors
                  }); 
            
          }).catch(err => {
              console.log(err)
          })
    }
     

        return () => {};
    }, [id]);

    if (!id) {
        return {user:{}, avatarUrl:''}
    }

    return {user:user, avatarUrl:avatarUrl}
}

export default useUser;