import People from "./People";

const PeoplePool = props => {
    console.log(props.people)
    const people = props.people.map((person) => <People following={props.following} key={person} person={person}/>)
    return(
        <section className="peoplepool">
            {people}
        </section>
    )
}

export default PeoplePool;