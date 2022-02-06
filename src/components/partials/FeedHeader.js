import classes from './FeedHeader.module.css';
import { GiMeat } from "react-icons/gi";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const FeedHeader = props => {
    const [isForYou, setisForYou] = useState(true);
    const navigate = useNavigate();
    const buttonStateHandler = () => {
        props.onFilterFeed(!isForYou)
        setisForYou(!isForYou);
    }

    const isES = (navigator.language === 'es');

    const toRegister = () => {
        navigate('/register')
    }

    const logoClickHandler = () => {
        if (window.location.pathname === '/') {
            document.querySelector('.feed').scrollTo({
                top: 0,
                behavior: "smooth"
              });
            window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            return;  
        }
        navigate('/')
    }

    return (
        <section className={classes.FeedHeader}>
            <button onClick={logoClickHandler}><GiMeat /></button>
            <div>
                <button className={(!isForYou) ? classes.Active : classes.Inactive} onClick={(localStorage.getItem('uid')) ? buttonStateHandler : toRegister}>{isES ? 'Siguiendo' : 'Following'}</button>
                <button className={(isForYou) ? classes.Active : classes.Inactive} onClick={buttonStateHandler}>{isES ? 'Para ti' : 'For you'}</button>
            </div>
        </section>
    );
}

export default FeedHeader;