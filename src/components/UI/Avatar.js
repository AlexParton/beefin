
const Avatar = props => {
    return(
        <div className={(props.isXL) ? 'avatarwrapper xl' : 'avatarwrapper'}>
            {(props.avatar && props.avatar !== '')
             && <img src={props.avatar} alt="avatar"/>
            }
           
        </div>
    )
}

export default Avatar;