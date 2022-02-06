const ReplyReference = props => {
    const isES = (navigator.language === 'es');
    const textHeading = (isES ? 'Respondiendo a:' : 'Replying to:')

    return(
        <section className="padding">
            <h2 className="reference-heading">{textHeading}</h2>
            <p>{props.text}</p>
        </section>
    )
}

export default ReplyReference;