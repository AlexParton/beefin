import { useEffect, useState } from 'react';
import classes from './Selector.module.css';

const Selector = props => {

    const [isActive, setIsActive] = useState(props.isActive)
 
    useEffect(() => {
        setIsActive(props.isActive)
    }, [props.isActive])

    const clickHandler = () => {
        props.onActivate();
        setIsActive(!isActive)
    }

    return(
        <div className={classes.Selector}>
            <p>{props.title}<span>{props.label}</span></p>
            <div className={classes.ButtonWrapper}><div className={(isActive) ? classes.ButtonActive : ''}><button onClick={clickHandler}></button></div></div>
        </div>
    )
}

export default Selector;