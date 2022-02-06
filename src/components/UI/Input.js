import { useEffect, useState } from 'react';
import classes from './Input.module.css';

const Input = props => {

    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('')

    const [hasValue, setHasValue] = useState(false);

    const [isTouched, setIsTouched] = useState(false);
    const valueIsValid = inputValue.trim() !== '';
    const hasError = !valueIsValid && isTouched;
    
    const checkValue = () => {
        (inputValue === '') ? setHasValue(false) : setHasValue(true);
        setIsFocused(false);
        setIsTouched(true);
    };

    const onChangeHandler = (event) => {
        setInputValue(event.target.value);
        setTimeout(() => {
           
            props.onInputChange(event);
        }, 300)
      
    };

    useEffect(() => {
       
        if (!!props.value) {
            console.log(props.value);
            setHasValue(true)
            setInputValue(props.value)
        } 
    },[props.value])

    
   
    return (
        <div className={`${classes.InputWrapper} ${isFocused ? 'focused' : ''} ${hasValue ? 'withValue' : ''} ${hasError ? 'error' : ''}`}>
            <label htmlFor={props.name}>{props.label}</label>
            <input
            value={inputValue}  
             onFocus={() => setIsFocused(true)} 
             onBlur={checkValue} 
             onChange={onChangeHandler}
             type={props.type} name={props.name}/>
        </div>
    )
}

export default Input;