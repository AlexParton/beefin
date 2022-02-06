import { Fragment, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { ImTwitter } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import classes from './Post.module.css';
const Options = props => {
    const sharingUrl = window.location.href + 'beef/' + props.beef.beefId;
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const isES = (navigator.language === 'es');
    const textShare = (isES) ? 'Compartir' : 'Share';
    const textCantDeletePrincipal = (isES) ? 'Este beef tiene respuestas y ya no puede ser eliminado.' : 'This beef already has replies and it can\'t be deleted.'
    const textCantDeleteMVA = (isES) ? 'Esta es la respuesta más votada y no se puede eliminar.' : 'This is the most voted reply and it can\'t be deleted.'
    const textNeed = (isES) ? 'Necesitas' : 'Do you need';
    const textSupport = (isES) ? ' ayuda' : ' support';
    const textCloser = (isES) ? ' Entendido' : 'Got it';
    
    const deleteHandler = () => {
        console.log(props.beef.beefId)
        if (props.isPrincipal) {
            if (props.beef.answers.length > 0) {
                setShowAlert(true)
                setAlertMessage(textCantDeletePrincipal)
            } else {
                props.onDeleteBeef(props.beef.beefId, null)
               
            }
        } else {
            if (props.isMVA) {
                setShowAlert(true)
                setAlertMessage(textCantDeleteMVA)
            } else {
                props.onDeleteBeef(props.beef.beefId, props.principal)
            }
           
        }
       
    }


    return (
        <Fragment>
            <div className={classes.OptionsWrapper}><button onClick={props.onOptionsClicked} className={classes.Options}><div></div><div></div><div></div></button></div>
            {props.onShow && <div  className={classes.OptionsModal}>
                <p>{textShare}</p>
                <a target='_blank' rel='noreferrer' title='share' href={`https://api.whatsapp.com/send?text=Check%20this%20beef%20out!%20::%20${sharingUrl}`}><BsWhatsapp /></a>
                <a target='_blank' rel='noreferrer' title='share' href={`https://twitter.com/intent/tweet?text=Check%20this%20beef%20out!%20::%20${sharingUrl}`}><ImTwitter /></a>
                {props.isSelf && <button onClick={deleteHandler}><AiFillDelete /></button>}
            </div>
            }
            {showAlert
            &&  <Fragment>
                    <button onClick={() => setShowAlert(false)} className='optionsoverlay'></button>
                    <div className='cantdelete'>
                        <h2>{alertMessage}</h2>
                        <p>{textNeed}<a href="mailto:support@beefin.app">{textSupport}</a>?</p>
                        <button onClick={() => setShowAlert(false)}>{textCloser}</button>
                    </div>  
                </Fragment>  
            }
                
        </Fragment>
    );
}

export default Options;

