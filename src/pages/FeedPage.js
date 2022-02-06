import { Fragment, useState, useEffect } from "react"
import FeedHeader from "../components/partials/FeedHeader"
import PostWrapper from "../components/post/PostWrapper";
import { collection, query, getFirestore, orderBy, where, doc, getDoc, limit, startAfter, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";
import Loader from "../components/UI/Loader";
import AllAnswers from "../components/post/AllAnswers";

const app = MyFirebase();


const FeedPage = props => {
    const [availableBeefs, setAvailableBeefs] = useState([]);
    const [availableBeefsFollowing, setAvailableBeefsFollowing] = useState([]);
    const [isForYou, setIsForYou] = useState(true);
    const [thereIsMore, setThereIsMore] = useState(true);
    const [thereIsMoreFollowing, setThereIsMoreFollowing] = useState(true);
    const [lastVisible, setLastVisible] = useState(false);
    const [lastFollowingVisible, setLastFollowingVisible] = useState(false);

    const db = getFirestore(app); 
   
    const getBeefs = async () => {
        if (thereIsMore) {
            if (isForYou) {
                const myQueryForYou = (lastVisible)
                ? query(collection(db, 'beefbook'), orderBy("timestamp", "desc"), startAfter(lastVisible), limit(10))
                : query(collection(db, 'beefbook'), orderBy("timestamp", "desc"), limit(10));
                onSnapshot(myQueryForYou, (querySnapshot) => {
                    const loadedBeefs = [...availableBeefs];
                    setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);
                    (querySnapshot.docs.length < 10) && setThereIsMore(false);
                    querySnapshot.forEach((doc) => {
                    loadedBeefs.push(doc.data());
                    });
                    setAvailableBeefs(loadedBeefs);
                })
            }
        }
        
        if (thereIsMoreFollowing) {
            if (!isForYou) {
                if (!!localStorage.getItem('uid')) {
                    const userRef = doc(db, "users", localStorage.getItem('uid'));
                    getDoc(userRef)
                    .then((user) => {
                        const followedIds = user.data().following;
                        const myQueryFollowing = (lastFollowingVisible)
                                        ? query(collection(db, 'beefbook'), where("userId", "in", followedIds), orderBy("timestamp", "desc"), startAfter(lastVisible), limit(10))
                                        : query(collection(db, 'beefbook'), where("userId", "in", followedIds), orderBy("timestamp", "desc"), limit(10));
                        onSnapshot(myQueryFollowing, (querySnapshotFollowing) => {
                            const loadedBeefsFollowing = [...availableBeefsFollowing];
                            setLastFollowingVisible(querySnapshotFollowing.docs[querySnapshotFollowing.docs.length-1]);
                            (querySnapshotFollowing.docs.length < 10) && setThereIsMoreFollowing(false);
                            querySnapshotFollowing.forEach((doc) => {
                                loadedBeefsFollowing.push(doc.data());
                            });
                            (loadedBeefsFollowing.length > 0) ? setAvailableBeefsFollowing(loadedBeefsFollowing) : setAvailableBeefsFollowing();
                        })
                    })          
                }
            }        
        }
       
    }

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled) {
            getBeefs();
        }
       
        return () =>  {
            isCancelled = true;
        }
    }, []);

    const [showAnswers, setShowAnswers] = useState(false);
    const [answersToShow, setAnswersToShow] = useState([]);
    const [answerId, setAnswerId] = useState();
    const showAnswersHandler = (answersPassed, answerIdPassed) => {
        setAnswersToShow(answersPassed)
        setAnswerId(answerIdPassed)
        setShowAnswers(true)
    }

    const hideAnswersHandler = () => {
        setShowAnswers(false)
    }

    const deleteBeefHandler = (beefToDelete, principalBeefId) => {
       
        if (principalBeefId === null) {
            deleteDoc(doc(db, "beefbook", beefToDelete));
        } else {
            deleteDoc(doc(db, "replybook", beefToDelete));
            const principalRef = doc(db, "beefbook", principalBeefId);
            getDoc(principalRef)
            .then((snap) => {
                const filteredAnswers = snap.data().answers.filter((answer) => answer.beefId !==beefToDelete);
                const principalRef = doc(db, "beefbook", principalBeefId);
                updateDoc(principalRef, {'answers': filteredAnswers})
                setShowAnswers(false)
            })
            
        }
    }

   
    const beefs = (isForYou && availableBeefs.length > 0) 
                    ? availableBeefs.map(beef => <PostWrapper onDeleteBeef={deleteBeefHandler} onScroll={scrolled} onSeeAnswers={showAnswersHandler} key={Math.floor(Math.random() * 100000)} beef={beef}/>)
                    : (availableBeefsFollowing[0] === false) 
                            ? <section>No beefs here</section>
                            : availableBeefsFollowing.map(beef => <PostWrapper onScroll={scrolled} onSeeAnswers={showAnswersHandler} key={Math.floor(Math.random() * 100000)} beef={beef}/>);

    const feedHandler = (isForYouSelected) => {
        setIsForYou(isForYouSelected)
    }

    const handleRefresh = () => {
       getBeefs();
    }

    function scrolled(event) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            handleRefresh()
        }
    }

   
    
    return (
        <Fragment>
             <FeedHeader onFilterFeed={feedHandler}/>
             <section className='feed' onScroll={scrolled}>
             {(availableBeefs.length > 0) ?  beefs : <div className="loaderwrapper"><Loader /></div>} 
             </section>
            {(!!answerId)
            &&  <section className={(showAnswers ? 'answersection showanswers' : 'answersection')}>
                    <AllAnswers onDeleteBeef={deleteBeefHandler} answers={answersToShow} beefId={answerId} onBack={hideAnswersHandler}/>
                </section>
            }
           
           
        </Fragment>
       
    )
}

export default FeedPage