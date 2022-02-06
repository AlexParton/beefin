import classes from './TextArea.module.css';
import { useState } from 'react';

const TextArea = props => {
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
        props.onInputChange(event);
    };

    return (
        <div className={`${props.max === 160 ? classes.TextArea : classes.TextAreaShort} ${hasError ? 'error' : ''} ${hasValue ? 'withValue' : ''}`}>
            <textarea
                defaultValue={props.placeholder}
                onFocus={() => setIsFocused(true)} 
                onBlur={checkValue}  
                onChange={onChangeHandler}
                maxLength={props.max} 
                type={props.type} name={props.name}
                >
            </textarea>
        </div>
    )
}

export default TextArea;