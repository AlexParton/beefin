import { Fragment, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "../components/partials/ProfileHeader";
import Avatar from "../components/UI/Avatar";
import classes from './ProfilePage.module.css';
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";
import { useEffect } from "react";
import SinglePost from "../components/post/SinglePost";
import useFollowing from "../hooks/use-following";
import useUser from "../hooks/use-user";
import useSettings from "../hooks/use-settings";
import PeoplePool from "../components/partials/PeoplePool";
import PoolHeader from "../components/partials/PoolHeader";
import useHash from "../hooks/use-hash";
const app = MyFirebase();

const ProfilePage = props => {
    const params = useParams();
    const location = useLocation();
    const profileHash = params.profileHash;
    const profileId = location.state.profileId;

    const isES = (navigator.language === 'es');
    const textFollowing = (isES) ? 'Siguiendo' : 'Following';
    const textFollowers = (isES) ? 'Seguidores' : 'Followers';
    const textWonBeefs = (isES) ? 'Ganados' : 'Won beefs';
    const textLostBeefs = (isES) ? 'Perdidos' : 'Lost beefs';
    const textFollow = (isES) ? 'Seguir' : 'Follow';
    const textSeeBeefs = (isES) ? 'Beefs' : 'Beefs';
    const textSeeReplies = (isES) ? 'Respuestas' : 'Replies';
    const textNoHaveBeefs = (isES) ? ' todavía no tiene beefs.' : 'doesn\'t have any beef yet';
    const textNoHaveReplies = (isES) ? ' todavía no tiene respuestas.' : 'doesn\'t have any reply yet';
    
    const {user, avatarUrl} = useUser(profileId);
    const {hideFollowedActive} = useSettings(profileId)
    const [isFollowed, setIsFollowed] = useState(false);
    const myUserHash = useHash(localStorage.getItem('uid'))
    const [wonBeefs, setWonBeefs] = useState(0);
    const [drawBeefs, setDrawBeefs] = useState(0);
    const [lostBeefs, setLostBeefs] = useState(0);
    const [totalBeefs, setTotalBeefs] = useState(0);
    const [profileBeefs, setProfileBeefs] = useState([{beefId:'', body:'', tag:''}]);
    const [profileReplies, setProfileReplies] = useState([{beefId:'', body:'', tag:''}])

    const db = getFirestore(app); 
    const myQuery = query(collection(db, 'beefbook'), where("userId", "==", profileId));

    const getBeefs = async () => {
        const querySnapshot = await getDocs(myQuery);
        const loadedBeefs = [];
        querySnapshot.forEach((doc) => {
            loadedBeefs.push(doc.data());
        });
       
        if (loadedBeefs.length > 0) {
            setWonBeefs(0);
            setLostBeefs(0);
            setDrawBeefs(0);
            loadedBeefs.forEach((beef) => {
                const selfVotes = beef.votedBy.length;
                if (!!beef.answers && beef.answers.length > 0) {
                    const sortedAnswers = beef.answers.sort((a, b) => (a.votedBy.length < b.votedBy.length) ? 1 : -1);
                    const bestAnswerVotes = sortedAnswers[0].votedBy.length;
                    (selfVotes > bestAnswerVotes) && setWonBeefs(wonBeefs + 1);
                    (selfVotes < bestAnswerVotes) && setLostBeefs(lostBeefs + 1);
                    (selfVotes === bestAnswerVotes) && setDrawBeefs(drawBeefs + 1);
                } else {
                    setDrawBeefs(drawBeefs + 1)
                }
            })
        }

        setProfileBeefs(loadedBeefs);
        setTotalBeefs(loadedBeefs.length);
    }

    const getReplies = () => {
        const replyQuery = query(collection(db, 'replybook'), where("userId", "==", profileId));
       
        getDocs(replyQuery)
        .then((querySnapshot) => {
            const loadedReplies = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.data())
                loadedReplies.push(doc.data());
            });
            setProfileReplies(loadedReplies);
        })
    }
   
    useEffect(() => {
        getBeefs();
        (user.followedBy && user.followedBy.length > 0) && setIsFollowed(user.followedBy.includes(localStorage.getItem('uid')));
        getReplies();
        return () => {}
    }, [profileId, avatarUrl])

    const [isShowBeefsOnly, setIsShowBeefsOnly] = useState(true);


    const followingCount = (user.following) ? user.following.length : 0;
    const followedCount = (user.followedBy) ? user.followedBy.length : 0;
    const displayBeefs = (profileBeefs.length === 0 || profileBeefs[0].beefId === '') 
                         ? <div className={classes.NoBeef}>{`${user.displayName} ${textNoHaveBeefs}`}</div> 
                         : profileBeefs.map((beef) => <SinglePost principalId={beef.beefId} key={beef.beefId} beef={beef} avatarUrl={avatarUrl}/>)
    ;
    
    const displayReplies = (profileReplies.length === 0 || profileBeefs[0].beefId === '') 
                        ? <div className={classes.NoBeef}>{`${user.displayName} ${textNoHaveReplies}`}</div> 
                        : profileReplies.map((beef) => <SinglePost principalId={beef.replyTo} key={Math.floor(Math.random() * 10000)} beef={beef} avatarUrl={avatarUrl}/>)
    ;      

    const {follow, unfollow} = useFollowing();
    const navigate = useNavigate()
    const handleFollow = () => {
        if (!localStorage.getItem('uid')) {
            navigate('/register');
            return
        }
        (!isFollowed) 
         ? follow(profileId, localStorage.getItem('uid'), profileHash, myUserHash)
         : unfollow(profileId, localStorage.getItem('uid'), profileHash, myUserHash)

        setIsFollowed(!isFollowed);
       
    }

    const showFollowingHandler = () => {
        setSeeFollowing(true)
    }

    const showFollowedHandler = () => {
        setSeeFollowers(true)
    }

    const [seeFollowing, setSeeFollowing] = useState(false);
    const [seeFollowers, setSeeFollowers] = useState(false);

     if (seeFollowing) {
         return  (
            <Fragment>
                <PoolHeader onBack={() => setSeeFollowing(false)} heading='Following'/>
                <PeoplePool people={user.following}/>
            </Fragment>
          )
     }

     if (seeFollowers) {
        return  (
            <Fragment>
                <PoolHeader onBack={() => setSeeFollowers(false)} heading='Followed by'/>
                <PeoplePool following={user.following} people={user.followedBy}/>
            </Fragment>
          )
    }

    const showBeefsHandler = () => {
        setIsShowBeefsOnly(true);
    }

    const showRepliesHandler = () => {
        setIsShowBeefsOnly(false);
    }

    

    return(
        <Fragment>
            <ProfileHeader isSelfProfile={false} userName={user.displayName}/>
            <section className={classes.Profile}>
                <Avatar isXL={true} avatar={avatarUrl}/>
                <h3>@{profileHash}</h3>
                <p>{user.desc}</p>
                <div className={classes.Stats}>
                    {(hideFollowedActive || followingCount === 0) ? <div><span>{followingCount}</span><span>{textFollowing}</span></div> : <button onClick={showFollowingHandler}><span>{followingCount}</span><span>{textFollowing}</span></button>}
                    {(hideFollowedActive || followingCount === 0) ? <div><span>{followedCount}</span><span>{textFollowers}</span></div> :  <button onClick={showFollowedHandler}><span>{followedCount}</span><span>{textFollowers}</span></button>}
                    <div><span>{wonBeefs}</span><span>{textWonBeefs}</span></div>
                    <div><span>{lostBeefs}</span><span>{textLostBeefs}</span></div>
                </div>
              
                <button onClick={handleFollow} className={isFollowed ? 'activated' : 'normal'}>{isFollowed ? textFollowing : textFollow}</button>
            </section>
            <section className={classes.FilterAction}>
                <button onClick={showBeefsHandler} className={(isShowBeefsOnly) ? classes.FilterActive : ''}>{textSeeBeefs}</button>
                <button onClick={showRepliesHandler} className={(!isShowBeefsOnly) ? classes.FilterActive : ''}>{textSeeReplies}</button>
            </section>
            <section className={classes.BeefWrapper}>
                {(isShowBeefsOnly)
                 ? displayBeefs
                 : displayReplies
                }
            </section>
        </Fragment>
    )
}

export default ProfilePage;