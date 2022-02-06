import classes from './ProfileHeader.module.css';
import { AiOutlineUserAdd as AddIcon} from "react-icons/ai";
import { FiSettings as SettingsIcon } from "react-icons/fi";
import { IoArrowBack as BackIcon } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const ProfileHeader = props => {
    const navigate = useNavigate()
    return(
        <section className={classes.Header}>
            <button onClick={() => navigate(-1)} className={classes.Settings}><BackIcon /></button>
            <h2>{props.userName}</h2>
            {(props.isSelfProfile) && 
            <div className={classes.Add}>
                <button onClick={props.onSettings}><SettingsIcon /></button> 
                <button onClick={props.onPeople}><AddIcon /></button>
            </div>
            }
            
           
        </section>
    )
}

export default ProfileHeader;