import { Fragment, useState, useEffect } from "react"
import FeedHeader from "../components/partials/FeedHeader"
import PostWrapper from "../components/post/PostWrapper";
import { collection, query, getFirestore, getDocs, orderBy, where, doc, getDoc } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";
import Loader from "../components/UI/Loader";
import AllAnswers from "../components/post/AllAnswers";
const app = MyFirebase();


const FeedPage = props => {
    const [availableBeefs, setAvailableBeefs] = useState([]);
    const [availableBeefsFollowing, setAvailableBeefsFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isForYou, setIsForYou] = useState(true);
    const db = getFirestore(app); 
   
    const getBeefs = async () => {
       
        const myQueryForYou = query(collection(db, 'beefbook'), orderBy("timestamp", "desc"));
        getDocs(myQueryForYou)
            .then((querySnapshot) => {
                const loadedBeefs = [];
                querySnapshot.forEach((doc) => {
                   loadedBeefs.push(doc.data());
                });
                setAvailableBeefs(loadedBeefs);
            })
            .catch(err => {
                console.log(err)
            }) 
        if (!!localStorage.getItem('uid')) {
            const userRef = doc(db, "users", localStorage.getItem('uid'));
            getDoc(userRef)
            .then((user) => {
                const followedIds = user.data().following;
                const myQueryFollowing = query(collection(db, 'beefbook'), where("userId", "in", followedIds), orderBy("timestamp", "desc"));
                getDocs(myQueryFollowing)
                    .then((querySnapshotFollowing) => {
                        const loadedBeefsFollowing = [];
                        querySnapshotFollowing.forEach((doc) => {
                            loadedBeefsFollowing.push(doc.data());
                        });
                        (loadedBeefsFollowing.length > 0) ? setAvailableBeefsFollowing(loadedBeefsFollowing) : setAvailableBeefsFollowing();
                    })
                    .catch(err => {
                        console.log(err)
                    }) 
            })          
        }
        
    }

    useEffect(() => {
        if (isLoading) {
            getBeefs();
           
        }
       
        return () =>  setIsLoading(false)
    }, [availableBeefs, availableBeefsFollowing]);

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
   
    const beefs = (isForYou && availableBeefs.length > 0) 
                    ? availableBeefs.map(beef => <PostWrapper onSeeAnswers={showAnswersHandler} key={Math.floor(Math.random() * 100000)} beef={beef}/>)
                    : (availableBeefsFollowing[0] === false) 
                            ? <section>No beefs here</section>
                            : availableBeefsFollowing.map(beef => <PostWrapper key={Math.floor(Math.random() * 100000)} beef={beef}/>);

    const feedHandler = (isForYouSelected) => {
        setIsForYou(isForYouSelected)
    }

    // if (showAnswers) { 
    //     return <AllAnswers answers={answersToShow} beefId={answerId} onBack={showAnswersHandler}/>
    // }
        
    return (
        <Fragment>
             <FeedHeader onFilterFeed={feedHandler}/>
             {(availableBeefs.length > 0) ? beefs : <div className="loaderwrapper"><Loader /></div>} 
             <section className={(showAnswers ? 'answersection showanswers' : 'answersection')}>
                <AllAnswers answers={answersToShow} beefId={answerId} onBack={hideAnswersHandler}/>
             </section>
           
        </Fragment>
       
    )
}

export default FeedPage