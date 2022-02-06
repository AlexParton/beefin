import Input from "../components/UI/Input";
import classes from './SearchPage.module.css';
import { IoArrowBack as BackIcon } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import MyFirebase from "../database/firebase";
import { useState, useEffect } from 'react';
import Post from "../components/post/Post";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import Loader from "../components/UI/Loader";
const app = MyFirebase();

const SearchPage = props => {
    const navigate = useNavigate();
    const [filteredBeefs, setFilteredBeefs] = useState([]);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const dbFirestore = getFirestore(app)
    
   
    const docRef = collection(dbFirestore, "beefbook");

    const isES = (navigator.language === 'es');
    const textSearching = (isES) ? '¿Buscando un beef?' : 'Looking for a beef?';
    const textSearch = (isES) ? 'Buscar beefs' : 'Search beefs';

    useEffect(() => {
        (location.state && location.state.query) && setSearchQuery(location.state.query);
        const myQuery = query(docRef, where("tag", "==", searchQuery));
       
        const fetchFirestore = async () => {
            let loadedBeefs = [];
            const querySnapshot = await getDocs((myQuery));
            querySnapshot.forEach((doc) => {
                loadedBeefs.push(doc.data());
            });
            setFilteredBeefs(loadedBeefs);
            setIsLoading(false)            
        }
        
        fetchFirestore()
        
    }, [searchQuery])

    const searchHandler = (event) => {
        setSearchQuery(event.target.value.toLowerCase())
    }

    return(
        <section>
            <div className={classes.SearchHeader}>
               <button onClick={() => navigate(-1)} className={classes.Settings}><BackIcon /></button>
               <h1>{textSearching}</h1>
               <Input value={searchQuery} onInputChange={searchHandler} name='search' type='text'  label={textSearch}/>
            </div>
            <div className={classes.ResultsWrapper}>
            {(isLoading)
             ? <div className="loaderwrapper"><Loader /></div>
             : filteredBeefs.map((beef) => <Post isSearch={true} isAnswers={true} key={beef.beefId} beef={beef}/>)
            }
             </div>
        </section>
    )
}

export default SearchPage;