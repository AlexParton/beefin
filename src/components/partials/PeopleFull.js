import useUser from "../../hooks/use-user";
import Avatar from "../UI/Avatar";
import classes from './People.module.css';
import useFollowing from "../../hooks/use-following";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useHash from "../../hooks/use-hash";
const PeopleFull = props => {
    const { avatarUrl } = useUser(props.person.userId);

    const user = props.person;
    const {follow, unfollow} = useFollowing();
    const [isFollowed, setIsFollowed] = useState(false);
    const myUserHash = useHash(localStorage.getItem('uid'))

    useEffect(() => {
        if (!!props.following) {
            setIsFollowed(props.following.includes(props.person))
        } else {
            setIsFollowed(true)
        }

        return () => {}
    }, [user])

    const handleFollow = () => {
        (!isFollowed) 
         ? follow(user.userId, localStorage.getItem('uid'), user.userHash, myUserHash)
         : unfollow(user.userId, localStorage.getItem('uid'), user.userHash, myUserHash)

         setIsFollowed(!isFollowed);
       
    }

    const isES = (navigator.language === 'es');

    const buttFollowed = (isES) ? 'Siguiendo' : 'Following';
    const buttNotFollowed = (isES) ? 'Seguir' : 'Follow';

    return(
        <section className={classes.Person}>
            <Link to={`/user/${user.hash}`} state={{avatarUrl: avatarUrl, profileId: user.userId, profileHash:user.hash, userName: user.displayName}}>
                <div className={classes.AvatarWrapper}>
                    <Avatar avatar={avatarUrl}/>
                </div>
                <div className={classes.TextWrapper}>
                    <p>{user.displayName}</p>
                    <p>{(!!user.desc && user.desc.length > 30) ? user.desc.substring(0,30)+'...' : user.desc}</p>
                </div>
            </Link>        
            <div className={classes.ButtonWrapper}>
                <button onClick={handleFollow} className={isFollowed ? 'activated xs' : 'normal xs'}>{isFollowed ? buttFollowed : buttNotFollowed}</button>
            </div>

        </section>
    )
}

export default PeopleFull;