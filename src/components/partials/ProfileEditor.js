import classes from './ProfileEditor.module.css';
import { Fragment, useState, useEffect } from 'react';
import Input from '../UI/Input';
import BigButton from '../UI/BigButton';
import { ImCamera } from "react-icons/im";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import Loader from '../UI/Loader';
import Compressor from 'compressorjs';
const ProfileEditor = props => {

    const [user, setUser] = useState(props.user)
    const [avatarUrl, setAvatarUrl] = useState(props.avatarUrl)
    const [enteredFoto, setEnteredFoto] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [isUploadedOk, setIsUploadedOk] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const db = getFirestore();
    const userId = localStorage.getItem('uid');

    async function savePicture(blobUrl, imgId) {
        const storage = getStorage();
        const imageRef = storageRef(storage, `/avatars/${imgId}`);
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob).then((snapshot) => {
            setIsUploadedOk(true)
          });
    }

    useEffect(() => () => {
        if (enteredFoto.startsWith('blob')) {
            URL.revokeObjectURL(enteredFoto)
        }
        return () => {}
    }, [enteredFoto]);

    const [userName, setUserName] = useState(props.user.displayName);
    const userNameHandler = (event) => {
        setUserName(event.target.value);
        setIsTouched(true)
    }

    const [userDesc, setUserDesc] = useState(props.user.desc);
    const userDescHandler = (event) => {
        setUserDesc(event.target.value);
        setIsTouched(true)
    }

    // const handleCapture = (event) => {
    //     if (event.target.files.length > 0) {
    //         const file = event.target.files.item(0);
    //         const imageUrl = URL.createObjectURL(file);
    //         setEnteredFoto(imageUrl);
    //         setAvatarUrl(imageUrl);
    //         setIsTouched(true)
    //     }
    // }    

    const handleCapture = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files.item(0);
            new Compressor(file , {
                quality: 0.8,
                width: 150,
                height:150,
                resize: "cover",
                success: (compressedFile) => {
                    const imageUrl = URL.createObjectURL(compressedFile);
                    setEnteredFoto(imageUrl);
                    setAvatarUrl(imageUrl);
                    setIsTouched(true);
                }
            }) 
           
        }
    }    

    const changeImgHandler = () => {
        setEnteredFoto('');
        setAvatarUrl('');
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (isTouched) {
            const userRef = doc(db, "users", userId);

            const imgId = Date.now();
            updateDoc(userRef, {"displayName": userName});
            updateDoc(userRef, {"desc": userDesc});

            if (enteredFoto && enteredFoto !== '') {
                savePicture(enteredFoto, imgId);
                updateDoc(userRef, {"avatarId": imgId});
                props.onAvatar(imgId)
            }
            
            setIsSaving(true);
            setTimeout(() => {
                props.onCancel()
            }, 2000)

        } else {
            props.onCancel()
        }
        
    }  

    const isES = (navigator.language === 'es');
    const userDefault = (isES) ? 'Nuevo usuario' : 'User name';
    const shortDescription = (isES) ? 'Descripción del perfil' : 'Short description';
    const addImage = (isES) ? 'Añade una imagen a tu perfil' : 'Add an image for your profile';
    const changeImageButt = (isES) ? 'Cambiar Imagen' : 'Change image';
    const cancel = (isES) ? 'Cancelar' : 'Cancel';
    const saveChanges = (isES) ? 'Guardar cambios' : 'Save changes';
    const savingChanges = (isES) ? 'Guardando cambios' : 'Saving changes';

    return(
        <section className={classes.Editor}>
            {isSaving
             ? <div>
                 <h2>{savingChanges}</h2>
                <Loader />  
               </div>
             : <Fragment>
                  <Input value={user.displayName} 
                   onInputChange={userNameHandler} 
                   name='username' type='text' 
                   label={(user.displayName) ? user.displayName : userDefault}
                  /> 
                  <Input value={user.desc} 
                   onInputChange={userDescHandler} 
                   name='desc' type='text'
                   label={(user.desc) ? user.desc : shortDescription}
                  /> 
                {(!avatarUrl || avatarUrl === '') 
                ? <Fragment>
                    <p className="disclaimer">{addImage}</p>
                    <BigButton icon={<ImCamera size={30}/>}>
                        <input
                            accept="image/*"
                            className="foto-input"
                            id="icon-button-file"
                            type="file"
                            onChange={handleCapture} 
                        />
                        </BigButton>
                    </Fragment>
                : <Fragment>
                        <div className={classes.UserImgHolder}>
                            <img src={avatarUrl} alt='user' />
                        </div>
                        <button onClick={changeImgHandler}>{changeImageButt}</button>
                    </Fragment>
                }               
                <div className={classes.Action}>  
                    <button className="normal" onClick={props.onCancel}>{cancel}</button>
                    <button className="activated" onClick={submitHandler}>{saveChanges}</button>   
                </div>
             </Fragment>
            }
           
        </section>
    )
}

export default ProfileEditor;