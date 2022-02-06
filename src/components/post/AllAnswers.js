import Post from "./Post";
import classes from './AllAnswers.module.css';
import { IoArrowBack as BackIcon } from "react-icons/io5";
import classesHeader from '../partials/ProfileHeader.module.css';

const AllAnswers = props => {

    const principalId = props.beefId;
    const linkedAnswers = props.answers;
    const answers = linkedAnswers.sort((a, b) => (a.votedBy.length < b.votedBy.length) ? 1 : -1);

    const isES = (navigator.language === 'es');
    const noBeefs = (isES) ? 'Este beef todavía no tiene respuestas' : 'This beef doesn\'t have replies yet'
    const textHeading = (isES) ? 'Todas las respuestas' : 'All replies'
    return(
        <section className="all-answers-modal">
            <section className={classesHeader.Header}>
                <button onClick={props.onBack} className={classesHeader.Settings}><BackIcon /></button>
                <h2>{textHeading}</h2>        
            </section>
            <div className="answers-wrapper">
                {(answers.length > 0)
                ? answers.map((answer) => <Post onDeleteBeef={props.onDeleteBeef} principal={{beefId: principalId}} isPrincipal={false} isMVA={answer.beefId === answers[0].beefId} isAnswers={true} key={answer.beefId} beef={answer} avatarUrl={false}/>)
                : <div className={classes.NoAnswers}>{noBeefs}</div>  
                }
            </div>
            
        </section>
    )
}

export default AllAnswers;

