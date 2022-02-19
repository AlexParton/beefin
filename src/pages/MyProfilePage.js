import { Fragment, useState } from "react";
import ProfileHeader from "../components/partials/ProfileHeader";
import Avatar from "../components/UI/Avatar";
import classes from './ProfilePage.module.css';
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";
import { useEffect } from "react";
import SinglePost from "../components/post/SinglePost";
import { IoArrowForward as ForwardIcon } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ProfileEditor from "../components/partials/ProfileEditor";
import PeoplePool from "../components/partials/PeoplePool";
import PoolHeader from "../components/partials/PoolHeader";
import PeopleFinder from "../components/partials/PeopleFinder";
import useUser from "../hooks/use-user";
import Selector from "../components/UI/Selector";
import useSettings from "../hooks/use-settings";

const app = MyFirebase();

const MyProfilePage = props => {
   
    const profileId = localStorage.getItem('uid');
    const {user, avatarUrl} = useUser(profileId);
    const [avatarEditable, setAvatarEditable] = useState(avatarUrl);
    const [wonBeefs, setWonBeefs] = useState(0);
    const [drawBeefs, setDrawBeefs] = useState(0);
    const [lostBeefs, setLostBeefs] = useState(0);
    const [totalBeefs, setTotalBeefs] = useState(0);
    const [profileBeefs, setProfileBeefs] = useState([{beefId:'', body:'', tag:''}]);
    const [profileReplies, setProfileReplies] = useState([{beefId:'', body:'', tag:''}])
    const [isEditMode, setIsEditMode] = useState(false);

    const isES = (navigator.language === 'es');
    const textEditProfile = (isES) ? 'Editar perfil' : 'Edit profile';
    const textFollowing = (isES) ? 'Siguiendo' : 'Following';
    const textFollowers = (isES) ? 'Seguidores' : 'Followers';
    const textWonBeefs = (isES) ? 'Ganados' : 'Won beefs';
    const textLostBeefs = (isES) ? 'Perdidos' : 'Lost beefs';
    const textSettings = (isES) ? 'Ajustes' : ' Profile settings';
    const textDarkMode = (isES) ? 'Modo oscuro' : 'Dark mode';
    const textHideLabel = (isES) ? 'Los demás usuarios no podrán ver quién te sigue ni a quién sigues.' : 'Users will not see who do you follow or who follows you'
    const textHideTitle = (isES) ? 'Modo privado' : 'Hide followed users';
    const textPushTitle = (isES) ? 'Permitir notificaciones' : 'Allow notifications';
    const textChangePass = (isES) ? 'Cambia contraseña' : 'Change password';
    const textLogout = (isES) ? 'Cerrar sesión' : 'Logout';
    const textDeleteAcc = (isES) ? 'Eliminar cuenta' : 'Delete account';
    const textSeeBeefs = (isES) ? 'Beefs' : 'Beefs';
    const textSeeReplies = (isES) ? 'Respuestas' : 'Replies';
    const textNoHaveBeefs = (isES) ? ' todavía no tienes beefs.' : 'You don\'t have any beefs yet';
    const textNoHaveReplies = (isES) ? ' todavía no tiene respuestas.' : 'doesn\'t have any reply yet';

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
        const orderedBeefs = loadedBeefs.sort((a,b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0))
        setProfileBeefs(orderedBeefs);
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
            const orderedBeefs = loadedReplies.sort((a,b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0))
            setProfileReplies(orderedBeefs);
        })
    }
   
    useEffect(() => {
        getBeefs();
        getReplies();
        return () => {}
    }, []);

    useEffect(() => {
        setAvatarEditable(avatarUrl);
        return () => {}
    }, [avatarUrl, isEditMode]);

    const [isShowBeefsOnly, setIsShowBeefsOnly] = useState(true);

    const followingCount = (user.following) ? user.following.length : 0;
    const followedCount = (user.followedBy) ? user.followedBy.length : 0;
   
    const displayBeefs = (profileBeefs.length === 0 ) 
                         ? <div className={classes.NoBeef}>{textNoHaveBeefs}</div> 
                         : profileBeefs.map((beef) => <SinglePost principalId={beef.beefId} key={beef.beefId} beef={beef} avatarUrl={avatarUrl}/>)
    ;
    
    const displayReplies = (profileReplies.length === 0 ) 
                        ? <div className={classes.NoBeef}>{`${user.displayName} ${textNoHaveReplies}`}</div> 
                        : profileReplies.map((beef) => <SinglePost principalId={beef.replyTo} key={Math.floor(Math.random() * 10000)} beef={beef} avatarUrl={avatarUrl}/>)
    ;     
    
    const [showSettings, setShowSettings] = useState(false);
    const {darkModeActive, hideFollowedActive, updateSetting} = useSettings(localStorage.getItem('uid'));
    
    const settingsHandler = () => {
        setShowSettings(!showSettings)
    }

    const navigate = useNavigate();
    const logoutHandler = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          localStorage.removeItem('uid');
          navigate('/register')
        }).catch((error) => {
          // An error happened.
        });
    }

    const [seeFollowing, setSeeFollowing] = useState(false);
    const [seeFollowers, setSeeFollowers] = useState(false);
    const [findPeople, setfindPeople] = useState(false);
    
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
 
    if (findPeople) {

        return  (
            <Fragment>
                <PoolHeader onBack={() => setfindPeople(false)} heading='Find people'/>
                <PeopleFinder following={user.following}/>
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
         
                {isEditMode
                    ?<Fragment>
                        <PoolHeader onBack={() => setIsEditMode(false)} heading='Edit profile'/>
                        <section className={classes.Profile}>
                            <ProfileEditor user={user} avatarUrl={avatarUrl} onCancel={() => setIsEditMode(false)} onAvatar={(imgId) => setAvatarEditable(imgId)}/>
                        </section>
                    </Fragment>

                    :<Fragment>
                        <ProfileHeader onPeople={() => setfindPeople(true)} onSettings={settingsHandler} isSelfProfile={true} userName={(isEditMode) ? textEditProfile : user.displayName}/>
                        <section className={classes.Profile}>
                            <Avatar isXL={true} avatar={avatarEditable}/>
                            <h3>@{user.hash}</h3>
                            <p>{user.desc}</p>
                            <div className={classes.Stats}>
                                <button onClick={() => setSeeFollowing(true)}><span>{followingCount}</span><span>{textFollowing}</span></button>
                                <button onClick={() => setSeeFollowers(true)}><span>{followedCount}</span><span>{textFollowers}</span></button>
                                <div><span>{wonBeefs}</span><span>{textWonBeefs}</span></div>
                                <div><span>{lostBeefs}</span><span>{textLostBeefs}</span></div>
                            </div>
                            <button onClick={() => setIsEditMode(true)} className='normal'>{textEditProfile}</button>
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
                }
            
            
         
            
             <section className={showSettings ? 'showsettings' : 'hidesettings'}>
                <button onClick={settingsHandler} className='settingsoverlay'></button> 
                <section className='settingsmodal'>
                    <div className='settingsmodal__header'>
                        <h2>{textSettings}</h2>
                        <button onClick={settingsHandler}><ForwardIcon /></button>
                    </div>
                    <div className="settings-item">
                        <Selector title={textDarkMode} isActive={darkModeActive} onActivate={()=>{updateSetting('darkmode', !darkModeActive)}}/>
                        <Selector label={textHideLabel} title={textHideTitle} isActive={hideFollowedActive} onActivate={()=>{updateSetting('hidefollowed', !hideFollowedActive)}}/>
                        <Selector title={textPushTitle} isActive={hideFollowedActive} onActivate={()=>{updateSetting('hidefollowed', !hideFollowedActive)}}/>
                    </div>
                    <h2>Account settings</h2>
                    <div className="accsettings">
                        <button onClick={() => navigate('/register', {state:'passchange'})}>{textChangePass}</button>
                        <button onClick={logoutHandler}>{textLogout}</button>
                        <button onClick={()=>{}}>{textDeleteAcc}</button>
                    </div>
                </section>
             </section>
            
           
        </Fragment>
    )
}

export default MyProfilePage;
