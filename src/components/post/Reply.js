import { Fragment, useState } from 'react';
import { collection, doc, setDoc, getFirestore, updateDoc, getDoc } from "firebase/firestore"; 
import MyFirebase from "../../database/firebase";
import TextArea from '../UI/TextArea';
import classes from './Reply.module.css';
import useHash from '../../hooks/use-hash';
import Loader from '../UI/Loader';
const app = MyFirebase();

const Reply = props => {
    const [beefValue, setBeefValue] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [beefLength, setBeefLength] = useState(0);
    const userHash = useHash(localStorage.getItem('uid'));
    const db = getFirestore(app);

    const isES = (navigator.language === 'es');
    const cancel = (isES) ? 'Cancelar' : 'Cancel';
    const submit = (isES) ? 'Validar' : 'Submit';
    const textWrite = (isES) ? 'Escribe tu respuesta' : 'Write your reply';
    const maxCharacter = (isES) ? 'caracteres' : 'characters left'

    const beefValueHandler = (event) => {
        setBeefValue(event.target.value)
        setBeefLength(event.target.value.length)
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const now = Date.now();
        const beefId = userHash + '$' + now;
        const beefRef = doc(db, 'beefbook', props.beef.beefId);
        const replyRef = collection(db, 'replybook');

        getDoc(beefRef)
            .then((docSnap) => {
                const post = {
                    beefId: beefId,
                    timestamp: now,
                    body: beefValue,
                    userId: localStorage.getItem('uid'),
                    userHash: userHash,
                    answers: [],
                    votedBy: []
        
                }
                const updatedAnswers = [...docSnap.data().answers, post];
                updateDoc(beefRef, {answers: updatedAnswers});
                return post
            })
            .then((post) =>{
                const reply = {};
                reply[post.beefId] = {
                    body: post.body,
                    timestamp: post.timestamp,
                    userId: post.userId,
                    userHash: post.userHash,
                    replyTo: props.beef.beefId,
                    tag: props.beef.tag,
                    replyId: post.beefId
                }
                
                setDoc(doc(replyRef, post.beefId), reply);
            
                return post
            })
            .then((post) => {
                setIsUploading(true);
                const notiRef = doc(db, 'notifications', props.beef.userId);
                const noti = {};
                const notiId = 'not' + now
                noti[notiId] = {
                    from: {
                        date:now,
                        userHash: userHash,
                        userId: localStorage.getItem('uid')
                    },
                    notificationId: notiId,
                    seen: false,
                    type: 'reply',
                    what: props.beef.beefId
                }
                updateDoc(notiRef, noti);
                setTimeout(() => {
                    setIsUploading(false);
                    props.onReplied(post)
                }, 1000)
            })
    }

    return (
        <section className={classes.Reply}>
            {isUploading
             ? <div className='loaderwrapper'><Loader /></div>
             : <Fragment>
                  <p>{textWrite} <span className={(beefLength > 140) ? classes.TextWarning : ''}>({160 - beefLength} {maxCharacter})</span></p>
                <TextArea onInputChange={beefValueHandler} max={160}/>
                <div className={classes.Action}>
                    <button onClick={props.onCancel}>{cancel}</button>
                    <button onClick={submitHandler}>{submit}</button>
                </div>
             </Fragment>
            }
           
        </section>
    )
}

export default Reply;