import classes from './BeefCreator.module.css';
import CommonHeader from '../components/partials/CommonHeader';
import TextArea from '../components/UI/TextArea';
import { useState } from 'react';
import { collection, doc, setDoc, getFirestore } from "firebase/firestore"; 
import MyFirebase from "../database/firebase";
import useHash from '../hooks/use-hash';
import Loader from '../components/UI/Loader';
import { useNavigate } from 'react-router-dom';
const app = MyFirebase();

const BeefCreator = props => {

    const [tagValue, setTagValue] = useState('');
    const [beefValue, setBeefValue] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [beefLength, setBeefLength] = useState(0);
    const [tagLength, setTagLength] = useState(0);
    const db = getFirestore(app);
    const navigate = useNavigate();
    const userHash = useHash(localStorage.getItem('uid'));

    const tagValueHandler = (event) => {
        setTagValue(event.target.value.toLowerCase())
        setTagLength(event.target.value.length)
    }
    const beefValueHandler = (event) => {
        setBeefLength(event.target.value.length)
        setBeefValue(event.target.value)
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const now = Date.now();
        const beefId = userHash + '$' + now;
        const beefRef = collection(db, 'beefbook')
        const post = {
            beefId: beefId,
            timestamp: now,
            body: beefValue,
            tag: tagValue,
            userId: localStorage.getItem('uid'),
            userHash: userHash,
            answers: [],
            votedBy: []

        }

        setDoc(doc(beefRef, beefId), post);
        setIsUploading(true);
        setTimeout(() => {
            navigate('/my-profile')
        }, 2000)
    }
    
    const isES = (navigator.language === 'es');
    const textUploading = (isES) ? 'Cargando' : 'Uploading';
    const textHeading = (isES) ? 'Escribe un beef' : 'Write a beef';
    const formTagger = (isES) ? '¿De qué va tu beef?' : 'What is your beef about?';
    const maxCharacter = (isES) ? 'caracteres' : 'characters left'
    const textWrite = (isES) ? 'Escribe tu beef' : 'Write your beef';
    const noEdit = (isES) ? 'Repasa tu beef antes de enviarlo. ¡No podrás editarlo después!' : 'Double-check your beef before sending it. You won\'t be able to edit it afterwards!';
    const textSubmit = (isES) ? '¡Beeféalo!' : 'Beef it up!';

    return(
        <section className={classes.Creator}>
           <CommonHeader heading={textHeading} />
           {(isUploading)
            ? <div className={classes.Uploading}><h2>{textUploading}</h2><Loader /></div>

            :<form className={classes.Body}>
                <div className={classes.Block}>
                    <p>{formTagger} <span className={(tagLength > 15) ? classes.TextWarning : ''}>({20 - tagLength} {maxCharacter})</span></p>
                    <TextArea onInputChange={tagValueHandler} max={20}/>
                </div>
                <div className={classes.Block}>
                    <p>{textWrite} <span className={(beefLength > 140) ?classes.TextWarning : ''}>({160 - beefLength} {maxCharacter})</span></p>
                    <TextArea onInputChange={beefValueHandler} max={160}/>
                    <p className={classes.Disclaimer}>{noEdit}</p>
                </div>
                <button onClick={submitHandler}>{textSubmit}</button>
             </form>
           }
           
        </section>
    )
}

export default BeefCreator;

// Beefin will be the next big social network application, much better than Twitter and less toxic also because only the best reply will matter.