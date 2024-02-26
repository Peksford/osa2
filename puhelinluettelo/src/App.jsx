import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import nameService from './services/names'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import './index.css'

const Notification = ({ message }) => {
  if (message === '') {
    return null
  }

  return <div className="message">{message}</div>
}

const ErrorMessage = ({ message }) => {
  if (message === '') {
    return null
  }

  return <div className="error">{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [newMessage, setMessage] = useState('')
  const [newError, setErrorMessage] = useState('')

  useEffect(() => {
    nameService.getAll().then((initialNames) => {
      setPersons(initialNames)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        nameService
          .update(existingPerson.id, { name: newName, number: newNumber })
          .then((updatedName) => {
            setPersons(
              persons
                .map((person) =>
                  person.id === existingPerson.id ? updatedName : person
                )
                .concat()
            )
            setMessage(`Added '${newName}'`)
            setTimeout(() => {
              setMessage('')
            }, 5000)
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(
                `Information of '${newName}' has already been removed from server`
              )
            } else {
              setErrorMessage('Error when deleting the person')
            }
            setTimeout(() => {
              setErrorMessage('')
            }, 5000)
          })
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      }
      nameService.create(nameObject).then((returnedName) => {
        setPersons(persons.concat(returnedName))
      })
      setMessage(`Added '${newName}'`)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = newSearch
    ? persons.filter(
        (person) =>
          person.name.toLowerCase().indexOf(newSearch.toLowerCase()) !== -1
      )
    : persons

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      nameService
        .deletedName(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
        })
        .catch((error) => {
          console.error('Error', error)
          if (error.response && error.response.status === 404) {
            setErrorMessage(
              `Information of '${name}' has already been removed from server`
            )
          } else {
            setErrorMessage('Error when deleting the person')
          }
          setTimeout(() => {
            setErrorMessage('')
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <Notification message={newMessage} />
      <ErrorMessage message={newError} />

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App
