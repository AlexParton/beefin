import { GiMeat } from "react-icons/gi";
import classes from './RegisterPage.module.css';
import Input from '../components/UI/Input';
import {  Fragment, useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import MyFirebase from "../database/firebase";
import Loader from "../components/UI/Loader";


const RegisterPage = props => {
    const app = MyFirebase();
    const db = getFirestore(app);
    const location = useLocation();
    const [isEntrar, setIsEntrar] = useState(true);

    const isES = (navigator.language === 'es');
    const textRepeatPass = (isES) ? 'Repetir contraseña' : 'Repeat password';
    const textWrongPass = (isES) ? 'Contraseña denegada' : 'Wrong password';
    const textWrongEmail = (isES) ? 'Este email no está registrado' : 'This e-mail is not registered';
    const textVoidEmail = (isES) ? 'Introduce tu dirección de email' : 'We need an e-mail address';
    const textPassMatch = (isES) ? 'Las contraseñas no coinciden' : 'Passwords doesn\'t match';
    const textPassInvalid = (isES) ? 'La contraseña tiene que ser de 6 caracteres mínimo' : 'The password needs to be at least 6 characters long';
    const textVoidName = (isES) ? 'Elige un nombre de usuario' : 'Choose a name to display';
    const textEmailExists = (isES) ? 'Este email ya está registrado' : 'This e-mail is already in use';
    const textEmailNotExists = (isES) ? 'Este email no está registrado' : 'This e-mail is not registered';
    const textNewPass = (isES) ? 'Nueva contraseña' : 'Enter new password';
    const textNewPassRepeat = (isES) ? 'Repetir nueva contraseña' : 'Repeat new password';
    const textUserName = (isES) ? 'Nombre de usuario' : 'User name';
    const textConfirm = (isES) ? 'CONFIRMAR CAMBIOS' : 'CONFIRM CHANGE';
    const textConfirmPasschange = (isES) ? 'La contraseña se ha cambiado' : 'Password changed succesfully!';
    const textEmail = (isES) ? 'Dirección de email' : 'E-mail address';
    const textPass = (isES) ? 'Contraseña' : 'Password';
    const textLogin = (isES) ? 'ENTRAR' : 'LOGIN';
    const textRegister = (isES) ? 'REGISTRARSE' : 'REGISTER';
    const dontHave = (isES) ? '¿Todavía no tienes cuenta? ' : 'Don\'t have an account yet? ';
    const alreadyHave = (isES) ? '¿Ya tienes cuenta? ' : 'Already have an account? ';
    const textEnter = (isES) ? ' ¡Entra!' : ' Log in!';
    const textRegistra = (isES) ? '¡Regístrate!' : 'Register!';
    const textForgot = (isES) ? 'Olvidé mi contraseña' : 'Forgot your password';
    const textRecovery = (isES) ? 'Recibir email de recuperación' : 'Send me a password recovery email';
    const textRecoverySent = (isES) ? 'Email de recuperación enviado' : 'Recovery e-mail sent succesfully!';
    const backRegister = (isES) ? 'Volver al registro' : 'Back to registration';




    const [enteredName, setEnteredName] = useState('');
    const nameHandler = (event) => {
        setShowErr(false);
        setEnteredName((event.target.value));
    }

    const [enteredEmail, setEnteredEmail] = useState('');
    const emailHandler = (event) => {
        setShowErr(false);
        setEnteredEmail((event.target.value));
        setResetErrorMessage('')
    }

    const [enteredPass, setEnteredPass] = useState('');
    const passHandler = (event) => {
        setShowErr(false);
        setEnteredPass((event.target.value))
    }

    const [enteredRepeatedPass, setEnteredRepeatedPass] = useState('');
    const repeatedPassHandler = (event) => {
        setShowErr(false);
        setEnteredRepeatedPass((event.target.value))
    }

    const repeatPass = (!isEntrar) ? <Input onInputChange={repeatedPassHandler} name='password' type='password'  label={textRepeatPass}/> : '';
    const passIsTheSame = (enteredPass === enteredRepeatedPass);
    const auth = getAuth();

    const navigate = useNavigate();

    const [errMessage, setErrMessage] = useState('');
    const [showErr, setShowErr] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    
    const submitHandler = (event) => {
        event.preventDefault();

        if (isEntrar) {
           
            signInWithEmailAndPassword(auth, enteredEmail, enteredPass)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('uid', user.uid);
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                if (errorCode === 'auth/wrong-password') {
                    setErrMessage(textWrongPass);
                    setShowErr(true);
                }
                if (errorCode === 'auth/user-not-found') {
                    setErrMessage(textWrongEmail);
                    setShowErr(true);
                }
            });
        } else {
            if (!enteredEmail) {
                setErrMessage(textVoidEmail);
                setShowErr(true);
                return
            }
            
            if (!passIsTheSame) {
                setErrMessage(textPassMatch);
                setShowErr(true);
                return
            }
           
            if (enteredPass.length < 6) {
                setErrMessage(textPassInvalid);
                setShowErr(true);
            }

            if (!enteredName) {
                setErrMessage(textVoidName);
                setShowErr(true);
                return
            }

            createUserWithEmailAndPassword(auth, enteredEmail, enteredPass)
            .then((userCredential) => {
        
                const user = userCredential.user;
                localStorage.setItem('uid', user.uid);
                const hash = enteredName.toLowerCase().replace(' ', '') + Math.floor(Math.random() * 1000000);
                const usersRef = collection(db, "users");
                
                const newUser = {displayName: enteredName, avatarId: '', userId: user.uid, hash: hash, followedBy: [], following: [], beefsVoted: [], desc:''};
                setDoc(doc(usersRef, user.uid), newUser);
                
                const usersSettingsRef = collection(db, "usersettings");
                const newUserSettings = {darkmode: false, hidefollowed: false};
                setDoc(doc(usersSettingsRef, user.uid), newUserSettings);
               
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    navigate(`/my-profile`)
                }, 2000)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                if (errorCode === 'auth/email-already-in-use') {
                    setErrMessage(textEmailExists);
                    setShowErr(true);
                }
                // ..
            });
        }

    }

    const [isForgotten, setIsForgotten] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [resetErrorMessage, setResetErrorMessage] = useState('');

    const handleForgotten = () => {
        if (enteredEmail !== '') {
            sendPasswordResetEmail(auth, enteredEmail)
            .then(() => {
                setResetSent(true);
                setTimeout(() => {
                    setIsForgotten(false)
                    setResetSent(false);
                }, 2000)
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/user-not-found') {
                
                    setResetErrorMessage(textEmailNotExists)
                }
                console.log(errorCode)
                // ..
            });
        }
    }

    const [passwordChangedOk, setPasswordChangedOk] = useState(false);
    const submitPassChangeHandler = () => {
        if (passIsTheSame) {
            updatePassword(auth.currentUser, enteredPass).then(() => {
                setPasswordChangedOk(true);
                setTimeout(() => {
                    navigate('/my-profile')
                }, 2000)
              }).catch((error) => {
                console.log(error)
              });
        }
    }
  
    if (location.state === 'passchange') {
        return (
            <section className={classes.Register}>
                <div className={classes.Header}>
                    <GiMeat />
                    <h1>Beefin'</h1>
                </div>
                <form className={classes.Form} onSubmit={submitPassChangeHandler}>
                    <Input onInputChange={passHandler} name='password' type='password'  label={textNewPass}/>
                    <Input onInputChange={repeatedPassHandler} name='password' type='password'  label={textNewPassRepeat}/>
                    {!isEntrar && <Input onInputChange={nameHandler} name='name' type='text'  label={textUserName}/>}
                    {(showErr) ? <p className="warning">{errMessage}</p> : ''}
                    <button>{textConfirm}</button>
                    {passwordChangedOk && <h2>{textConfirmPasschange}</h2>}
                </form>
            </section>
        );
    }

    return(
        <section className={classes.Register}>
            <div className={classes.Header}>
                <GiMeat />
                <h1>Beefin'</h1>
            </div>
            {(isLoading)
             ? <div className={classes.Success}>
                 <h1>Succesfully registered</h1>
                 <h2>Bring it on!</h2>
                <Loader />
              </div>
             : <Fragment>
                 {(!isForgotten)
                  ? <Fragment>
                      <form className={classes.Form} onSubmit={submitHandler}>
                        <Input onInputChange={emailHandler} name='email' type='text'  label={textEmail}/>
                        <Input onInputChange={passHandler} name='password' type='password'  label={textPass}/>
                        {repeatPass}
                        {!isEntrar && <Input onInputChange={nameHandler} name='name' type='text'  label={textUserName}/>}
                        {(showErr) ? <p className="warning">{errMessage}</p> : ''}
                        <button>{(isEntrar) ? textLogin : textRegister}</button>
                        </form>
                        {isEntrar && <button onClick={() => setIsForgotten(true)} className={classes.Forgot}>{textForgot}</button>} 
                        <button 
                            onClick={() => setIsEntrar(!isEntrar)} 
                            className={classes.Cta2}>{(isEntrar) ? dontHave : alreadyHave} 
                            <strong>{(isEntrar) ? textRegistra : textEnter}</strong>
                        </button>
                        {!isEntrar &&  <div className={classes.Terms}><p>By registering you accept our </p><a href={'https://beefin.company/terms'}>Terms of Service</a></div>}
                    </Fragment>
                  : <Fragment>
                       <Input onInputChange={emailHandler} name='email' type='text'  label={textEmail}/>
                       <button onClick={handleForgotten} className={classes.SendRecovery}>{textRecovery}</button>
                       {(resetErrorMessage !== '') && <h2>{resetErrorMessage}</h2>}
                       {resetSent ? <h2>{textRecoverySent}</h2> : <button onClick={() => setIsForgotten(false)} className={classes.Forgot}>{backRegister}</button>}
                    </Fragment> 
                 }
                </Fragment>
            }
        </section>
    )
}

export default RegisterPage;