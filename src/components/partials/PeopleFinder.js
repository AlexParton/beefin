import { useEffect, useState } from "react";
import PeopleFull from "./PeopleFull";
import { collection, query, getFirestore, getDocs, limit } from "firebase/firestore"; 
import MyFirebase from "../../database/firebase";
import Loader from "../UI/Loader";

const app = MyFirebase();

const PeopleFinder = props => {
    const [people, setPeople] = useState();
    const db = getFirestore(app);
    const [following, setFollowing] = useState()
    const myQuery = query(collection(db, "users"), limit(10));

    const getProfiles = () => {
        getDocs(myQuery)
        .then((querySnapshotFollowing) => {
            const loadedProfiles = [];
            querySnapshotFollowing.forEach((doc) => {
                
                if (!!following) {
                    if (doc.data().userId !== localStorage.getItem('uid') && !following.includes(doc.data().userId)) {
                        loadedProfiles.push(doc.data());
                    }
                }
                
            
            });
            (loadedProfiles.length > 0) ? setPeople(loadedProfiles) : setPeople();
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err)
        }) 
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setFollowing(props.following);
        getProfiles()
        return () => {}
        
    }, [following])

    if (isLoading) {
        return <div className="loaderwrapper"><div className="loaderwrapper"><Loader /></div></div>
    }

    return(
        <section>
            {(!!people) && people.map((person) => <PeopleFull following={[]} key={Math.floor(Math.random() * 10000)} person={person}/>)}
        </section>
    )
}

export default PeopleFinder;