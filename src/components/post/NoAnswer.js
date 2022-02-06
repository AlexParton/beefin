import { Fragment } from 'react';
import classes from './NoAnswer.module.css';

const NoAnswer = props => {

    const isES = (navigator.language === 'es');
    const heading = (isES) ? 'Aquí no hay beef todavía.' : 'Nobody started a beef here yet.';
    const sub = (isES) ? '¿Quieres empezarlo tú?' : 'Do you want to be the first?';
    const butt = (isES) ? 'Responder' : 'Reply';

    const isSelfBeef = (localStorage.getItem('uid') === props.beef.userId)

    return(
        <section className={classes.NoAnswer}>
            <div>
                <h2>{heading}</h2>
                {!isSelfBeef &&
                <Fragment>
                   <p>{sub}</p>
                   <button onClick={props.onReply}>{butt}</button>
                </Fragment> 
                }
                
            </div>
        </section>
        )
}

export default NoAnswer;