import { doc, getFirestore, getDoc } from "firebase/firestore"; 
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyFirebase from "../../database/firebase";
import ProfileHeader from "../partials/ProfileHeader";
import PostWrapper from "./PostWrapper";
import AllAnswers from "../post/AllAnswers";

const app = MyFirebase();


const BeefDetail = props => {
    const params = useParams();
    const beefId = params.beefId;
    const [loadedBeef, setLoadedBeef] = useState({beefId: beefId, body:'', userId:'', votedBy:[], answers:[], tag:''});
    const [isSelfProfile, setIsSelfProfile] = useState(false);
    const db = getFirestore(app);
    const beefRef = doc(db, "beefbook", beefId);

    useEffect(() => {
        let isCancelled = false;
        (!isCancelled) && getDoc(beefRef).then((docSnap) =>  setLoadedBeef(docSnap.data()));
        
        return () => {
            isCancelled = true
        }
    }, [])

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

    return(
        <Fragment>
            <ProfileHeader isSelfProfile={isSelfProfile} userName=''/>
            <PostWrapper onSeeAnswers={showAnswersHandler} beef={loadedBeef} />
            {(!!answerId)
            &&  <section className={(showAnswers ? 'answersection showanswers' : 'answersection')}>
                    <AllAnswers answers={answersToShow} beefId={answerId} onBack={hideAnswersHandler}/>
                </section>
            }
        </Fragment>
        )
}

export default BeefDetail;