import classes from './ProfileHeader.module.css';
import { IoArrowBack as BackIcon } from "react-icons/io5";

const PoolHeader = props => {
   
    return(
        <section className={classes.Header}>
            <button onClick={props.onBack} className={classes.Settings}><BackIcon /></button>
            <h2>{props.heading}</h2>
        </section>
    )
}

export default PoolHeader;