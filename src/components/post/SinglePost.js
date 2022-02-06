
import { Link } from "react-router-dom";
import useTimestamp from "../../hooks/use-timestamp";
import Avatar from "../UI/Avatar";
import classes from './SinglePost.module.css';


const SinglePost = props => {    
    const timeStamp = useTimestamp(props.beef.timestamp);
    return (
        
        <Link to={`/beef/${props.principalId}`} className={classes.SinglePost}>
            <Avatar avatar={props.avatarUrl}/>
            <div className={classes.Right}>
                <p>{(props.beef.tag !== '') && props.beef.tag}</p>
                <p>{props.beef.body}</p>
                <p>{timeStamp}</p>
            </div>
           
        </Link>
    )
}

export default SinglePost;