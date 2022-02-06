import classes from './Post.module.css';
import { Fragment, useState } from 'react';
import { AiOutlineLike as Like } from "react-icons/ai";
import { VscVerified as VerifiedIcon} from "react-icons/vsc";
import Avatar from '../UI/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/use-user';
import useTimestamp from '../../hooks/use-timestamp';
import useVote from '../../hooks/use-vote';
import useVoting from '../../hooks/use-voting';
import useGetvotes from '../../hooks/use-getvote';
import useHash from '../../hooks/use-hash';
import Options from './Options';

const Post = props => {

    const {user, avatarUrl} = useUser(props.beef.userId);
    const isPrincipal = (!!props.isPrincipal || props.isSearch)
    const principalId = (isPrincipal) ? null : props.principal.beefId;

    const votes = useGetvotes(isPrincipal, principalId, props.beef.beefId);
    const rawpercentage = (!!props.totalVotes) ? votes * 100 / props.totalVotes : 100;
    const percentage = (props.totalVotes === 0) ? '50' : rawpercentage.toFixed(0);
    const isWinning = (percentage >= 50);
    const voterHash = useHash(localStorage.getItem('uid'));
    const isVoted = useVote(isPrincipal, props.beef.beefId, principalId);
    const isMostVoted = (props.isMVA);

    const body = (!props.isSearch) ? props.beef.body : <Link to={`/beef/${props.beef.beefId}`}>{props.beef.body}</Link>

    const timeStamp = useTimestamp(props.beef.timestamp);

    const handleVote =  useVoting() 
    const navigate = useNavigate();    
    const likeButtonHandler = () => {
        if (localStorage.getItem('uid')) {
            const action = (isVoted) ? 'unvote' : 'vote';
            handleVote(action, isPrincipal, props.beef.beefId, principalId, props.beef.userId, voterHash)
        } else {
            navigate('/register');
        }
      
    }

    const isES = (navigator.language === 'es');
    const textVotes = (isES) ? 'voto' : 'vote';
    const textMostVoted = (isES) ? 'Respuesta más votada' : 'Most voted reply';
    const textAllReplies = (isES) ? 'Respuestas' : 'All replies';
    const textReply = (isES) ? 'Responder' : 'Reply';

    const textNoAnswers = (isES) ? 'Sin respuesta' : 'No replies';
    const textYourNoAnswers = (isES) ? 'Tu beef todavía no tiene respuestas' : 'Your beef doesn\'t have replies yet';

    const userLink = (props.beef.userId === localStorage.getItem('uid')) ? '/my-profile' : `/user/${props.beef.userHash}`;

    const [onShow, setOnShow] = useState(false);
    const touchHandler = (event) => {
        if (typeof(event.target.className) === 'string') {
            if (!event.target.className.includes('Post_OptionsModal'))
            setOnShow(false)
        }
    }

    const tagDisplay = ((isPrincipal || props.isSearch) && props.beef.tag !=='') ? props.beef.tag : props.tag

    return (
        <section onTouchEnd={touchHandler} className={`${classes.Post} ${(!isPrincipal) ? 'principal' : ''} ${(props.isAnswers) ? 'answerpost' : ''}`}>
            <div className={classes.Left}>
                <Link to={userLink} state={{avatarUrl: avatarUrl, profileId: props.beef.userId, profileHash:props.beef.userHash, userName: user.displayName}}><Avatar avatar={avatarUrl}/></Link>
                <div className={classes.Stats}>
                    {!props.isAnswers && <span className={!!isWinning ? classes.Winning : ''}>{percentage}%</span>}
                    <span className={!!isWinning ? classes.Winning : ''}>{votes} {textVotes}{(votes !== 1) && 's'}</span> 
                </div>
            </div>
            <div className={(props.isAnswers) ? classes.AnswersRight : classes.Right}>
                {(isMostVoted) && <span className={classes.Mva}><VerifiedIcon /> {textMostVoted}</span>}
                <div className={classes.NameWrapper}>
                    <Link to={userLink} state={{avatarUrl: avatarUrl, profileId: props.beef.userId, userName: user.displayName}}>
                        <p className={(props.isAnswers) ? classes.AnswerName : classes.Name}>{user.displayName}</p>
                    </Link>
                    <Link className={classes.TagWrapper} to={'/search'} state={{query: tagDisplay}}>{tagDisplay}</Link>
                    <Options principal={(isPrincipal) ? props.beef.beefId : props.principal.beefId} onDeleteBeef={props.onDeleteBeef} onShow={onShow} beef={props.beef} onOptionsClicked={() => setOnShow(true)} isPrincipal={isPrincipal} isSelf={(localStorage.getItem('uid') === props.beef.userId)} isMVA={props.isMVA}/>      
                </div>
                {props.beef.body && <p className={(props.isAnswers) ? classes.AnswerText : classes.BeefText}>{body}<span>{timeStamp}</span></p>}
                <div className={`${(!props.isAnswers) ? classes.Action : ''} ${(localStorage.getItem('uid') === props.beef.userId) ? classes.SelfAction : ''}`}>
                    {(props.isPrincipal) &&
                    <Fragment>
                        {(!!props.beef.answers && props.beef.answers.length > 0) 
                          ? <div><button className='leftalign' onClick={props.onSeeAnswers}>{textAllReplies}</button></div>
                          : <div>{(localStorage.getItem('uid') === props.beef.userId) ? textYourNoAnswers : textNoAnswers}</div>
                        }
                        <div className={(localStorage.getItem('uid') === props.beef.userId) ? 'hidden' : ''}><button onClick={props.onReply}>{textReply}</button></div>
                    </Fragment>
                    }
                    <div className={(localStorage.getItem('uid') === props.beef.userId) ? 'hidden' : ''}>
                        <div className={(props.isAnswers) ? classes.AnswerLike : ''}>
                            <button onClick={likeButtonHandler} className={(isVoted) ? 'likebutton liked' : 'likebutton'}><Like /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Post;