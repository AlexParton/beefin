import classes from './PostWrapper.module.css';
import Post from './Post';
import NoAnswer from './NoAnswer';
import { useState } from 'react';
import Reply from './Reply';
import ReplyReference from './ReplyReference';
import { useNavigate } from 'react-router-dom';

const PostWrapper = props => {

    const bestAnswerHandler = () => {
        if (typeof(props.beef.answers) === 'object' && props.beef.answers.length > 0) {
            const sortedAnswers = props.beef.answers.sort((a, b) => (a.votedBy.length < b.votedBy.length) ? 1 : -1);
            return sortedAnswers[0];
        } 
    }

    const beefVotesHandler = () => {
        if (!!bestAnswerHandler() && bestAnswerHandler().votedBy.length > 0) {
            return bestAnswerHandler().votedBy.length + props.beef.votedBy.length
        } else {
            return props.beef.votedBy.length
        }
    }
   
    const [isReplying, setIsReplying] = useState(false);

    const repliedHandler = (newReply) => {
        setIsReplying(false);
       
        const localUpdatedReplies = [...props.beef.answers, newReply]
        props.onSeeAnswers(localUpdatedReplies, props.beef.beefId)
    }

    const navigate = useNavigate()
    const onReplyHandler = () => {
        if (localStorage.getItem('uid')) {
            setIsReplying(true)
           
        } else {
            navigate('/register')
        }  
    }

    const cancelReplyingHandler = () => {
        setIsReplying(false)
        
    }

    return (
        <section data-item="true" className={classes.PostWrapper}>

             {(!isReplying) 
               ? 
               <Post    
                 key={Math.floor(Math.random() * 100000)} 
                 isAnswers={false} 
                 isPrincipal={true} 
                 beef={props.beef} 
                 totalVotes={beefVotesHandler()} 
                 onReply={onReplyHandler}
                 onSeeAnswers={() => props.onSeeAnswers(props.beef.answers, props.beef.beefId)}
                 onDeleteBeef={props.onDeleteBeef}
               />
               : <Reply beef={props.beef} onCancel={cancelReplyingHandler} onReplied={repliedHandler}/>
            }
            <div className='separator'></div>
            {(!bestAnswerHandler() && !isReplying) && <NoAnswer beef={props.beef}  onReply={onReplyHandler}/>}
            {(!!bestAnswerHandler() && !isReplying) && <Post  onDeleteBeef={props.onDeleteBeef} isMVA={true} principal={props.beef} key={Math.floor(Math.random() * 100000)} isAnswers={false} isPrincipal={false} beef={bestAnswerHandler()} totalVotes={beefVotesHandler()} tag={props.beef.tag}/>}
            {isReplying && <ReplyReference text={props.beef.body} />}
        </section>
    )
}

export default PostWrapper;