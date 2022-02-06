import classes from './Bottombar.module.css';
import { AiFillHome as HomeIcon, AiOutlineUser as UserIcon } from "react-icons/ai";
import { FiBell } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import useNotification from '../../hooks/use-notification';


const Bottombar = props => {
    const {newNotification, howManyNotifications} = useNotification();
    const navigate = useNavigate();
    const homeButtonHandler = () => {
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
    

    const isES = (navigator.language === 'es');  

    return (
        <ul className={classes.Bottombar}>
            <li>
                <button onClick={homeButtonHandler}><HomeIcon /><span>{isES ? 'Inicio' : 'Home'}</span></button>
            </li>
            <li>
                <Link state={{query: ''}} to={'/search'}><BsSearch /><span>{isES ? 'Buscar' : 'Search'}</span></Link>
            </li>
            <li>
                <Link to={(localStorage.getItem('uid')) ? '/beef-creator' : '/register'} className={classes.CustomAdd}><GrAdd /></Link>
            </li>
            <li>
            <Link to={(!!localStorage.getItem('uid')) ? '/interactions' : '/register'}><FiBell /><span>{isES ? 'Actividad' : 'Activity'}</span></Link>
            {(newNotification && howManyNotifications > 0) && <div className={classes.NotiAlert}><span>{(howManyNotifications < 100) ? howManyNotifications : '99'}</span></div>}
            </li>
            <li>
                <Link to={(!!localStorage.getItem('uid')) ? `/my-profile` : '/register'} ><UserIcon /><span>{isES ? 'Mi Perfil' : 'Profile'}</span></Link>
            </li>
        </ul>
    )
}

export default Bottombar