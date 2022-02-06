import classes from './ProfileHeader.module.css';
import { IoArrowBack as BackIcon } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const CommonHeader = props => {
    const navigate = useNavigate()
    return(
        <section className={classes.Header}>
            <button onClick={() => navigate(-1)} className={classes.Settings}><BackIcon /></button>
            <h2>{props.heading}</h2>        
        </section>
    )
}

export default CommonHeader;