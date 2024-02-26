const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name + ' '}
          {person.number + ' '}
          <button
            type="button"
            onClick={() => handleDelete(person.id, person.name)}
          >
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

export default Persons
