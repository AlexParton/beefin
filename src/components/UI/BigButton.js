import classes from './BigButton.module.css';

const BigButton = props => {
    return (
        <button className={classes.Button}>{props.icon}{props.children}</button>
    );
}

export default BigButton;