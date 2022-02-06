import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useUser from "../../hooks/use-user";
import Avatar from "../UI/Avatar";
import classes from "./Notification.module.css";
import useFollowing from "../../hooks/use-following";

const Notification = props => {
    const notificatorHash = props.notification.from.userHash;
    const notificatorId = props.notification.from.userId;
    const {user, avatarUrl} = useUser(notificatorId);
    const [isSeen, setIsSeen] = useState(props.notification.seen)
    const {follow, unfollow} = useFollowing();
    const [isFollowed, setIsFollowed] = useState(false);
   
    if (!isSeen) {
        setTimeout(() => setIsSeen(true), 3000)
    }
   
    useEffect(() => {
        if (!!user.userId) {
            if (user.followedBy.includes(localStorage.getItem('uid'))) {
                setIsFollowed(true)
            } else {
                setIsFollowed(false)
            }
        }
       

        return () => {}
    }, [user]);

    const handleFollow = () => {
       
        (!isFollowed) 
         ? follow(user.userId, localStorage.getItem('uid'))
         : unfollow(user.userId, localStorage.getItem('uid'))

         setIsFollowed(!isFollowed);
    }

    const isES = (navigator.language === 'es');

    const buttFollowed = (isES) ? 'Siguiendo' : 'Following';
    const buttNotFollowed = (isES) ? 'Seguir' : 'Follow back';
    const nowFollowingYou = (isES) ? 'ahora te sigue.' : 'is now following you.';
    const someoneVoted = (isES) ? 'ha votado uno de tus beefs.' : 'voted for one of your beefs.';
    const someoneReplied = (isES) ? 'ha respondido a uno de tus beefs.' : 'replied to one of your beefs.';
    const deletedNotificator = (isES) ? 'Esta notificación ya no está disponible, el usuario ha eliminado su cuenta.' : 'Notification not available, this user has deleted their account';

    if (!user.userId) {
        return (<section className={classes.Notification}>{deletedNotificator}</section>)
    }

    return(
        <section className={(!!isSeen) ? classes.Notification : classes.Unseen}>
            <Link to={`/user/${notificatorHash}`} state={{avatarUrl: avatarUrl, profileId: notificatorId, profileHash:notificatorHash, userName: user.displayName}} className={classes.Left}>
                <Avatar avatar={avatarUrl} />
            </Link>
            {props.notification.type === 'follow'
             && <div className={classes.Right}>
                  <div className={classes.WhoMid}><Link to={`/user/${notificatorHash}`} state={{avatarUrl: avatarUrl, profileId: notificatorId, profileHash:notificatorHash, userName: user.displayName}}>{user.displayName}</Link><p>{nowFollowingYou}</p><span>{props.time}</span></div>
                  <div className={classes.Action}><button className={isFollowed ? 'activated' : 'normal'} onClick={handleFollow}>{(isFollowed) ? buttFollowed : buttNotFollowed}</button></div>
               </div>
            }
            {props.notification.type === 'vote'   
             && <div className={classes.Right}>
                  <div className={classes.Who}><Link to={`/user/${notificatorHash}`} state={{avatarUrl: avatarUrl, profileId: notificatorId, profileHash:notificatorHash, userName: user.displayName}}>{user.displayName}</Link><Link to={`/beef/${props.notification.what}`}><p>{someoneVoted}</p><span>{props.time}</span></Link></div> 
               </div>
            }
            {props.notification.type === 'reply'   
             && <div className={classes.Right}>
                  <div className={classes.Who}><Link to={`/user/${notificatorHash}`} state={{avatarUrl: avatarUrl, profileId: notificatorId, profileHash:notificatorHash, userName: user.displayName}}>{user.displayName}</Link><Link to={`/beef/${props.notification.what}`}><p>{someoneReplied}</p><span>{props.time}</span></Link></div> 
               </div>
            }  
        </section>
    )
}

export default Notification;