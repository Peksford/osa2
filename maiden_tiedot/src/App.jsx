//import { useState } from 'react'
//require('dotenv').config()
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all/'
import './index.css'

const api_key = import.meta.env.VITE_SOME_KEY
// muuttujassa api_key on nyt käynnistyksessä annettu API-avaimen arvo

const SearchCountries = ({ newSearch, handleSearchChange }) => {
  return (
    <form>
      find countries: <input value={newSearch} onChange={handleSearchChange} />
    </form>
  )
}

const getAll = (baseUrl) => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const Countries = ({ filteredCountries, showInfo }) => {
  if (filteredCountries.length < 10 && filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map((country) => (
          <p key={uuidv4()}>
            {country.name.common}
            <button type="button" onClick={() => showInfo(country)}>
              show
            </button>
          </p>
        ))}
      </div>
    )
  } else if (filteredCountries.length === 1) {
    showInfo(filteredCountries[0])
  } else if (filteredCountries.length === 0) {
    return <div>No matches</div>
  } else {
    return <div>Too many matches, specify another filter</div>
  }
}

const Weather = ({ selectedCountry }) => {
  const [weather, setWeather] = useState('')
  //console.log('Weather component', selectedCountry)
  useEffect(() => {
    const request = axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital[0]}&appid=${api_key}`
    )
    request
      .then((response) => response.data)
      .then((initialWeather) => {
        setWeather(initialWeather)
        console.log('Lampotila', initialWeather)
      })
  }, [null])

  return (
    <div>
      {weather ? (
        <div>
          <h2> Weather in {`${selectedCountry.capital[0]}`}</h2>
          <p>
            {`${Math.round((weather.main.temp - 273.15) * 100) / 100} Celsius`}
          </p>
          <p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
          </p>
          <p>{`wind ${weather.wind.speed} m/s`}</p>
        </div>
      ) : (
        <p>Loading... </p>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    getAll(baseUrl).then((initialCountries) => {
      setCountries(initialCountries)
    })
  }, [])

  const filteredCountries = newSearch
    ? countries.filter(
        (country) =>
          country.name.common.toLowerCase().indexOf(newSearch.toLowerCase()) !==
          -1
      )
    : countries

  const showInfo = (country) => {
    //console.log("MIKAMAA", country.capital)
    setTimeout(() => {
      setSelectedCountry(country)
    }, 0)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    setSelectedCountry(null)
    console.log('Typing..')
  }

  return (
    <div>
      <SearchCountries
        newSearch={newSearch}
        handleSearchChange={handleSearchChange}
      />

      {selectedCountry ? (
        <div>
          <div key={uuidv4()}>
            <h2>{selectedCountry.name.common}</h2>
            capital {selectedCountry.capital}
            <br />
            area {selectedCountry.area}
            <br />
            population {selectedCountry.population}
            <h3>languages</h3>
            <ul>
              {Object.values(selectedCountry.languages).map(
                (language, languageId) => (
                  <li key={languageId}> {language}</li>
                )
              )}
            </ul>
            <div>
              <img
                src={selectedCountry.flags.png}
                style={{ width: '200px', height: 'auto' }}
                alt="An image"
              />
            </div>
            <Weather selectedCountry={selectedCountry} />
          </div>
        </div>
      ) : (
        <Countries filteredCountries={filteredCountries} showInfo={showInfo} />
      )}
    </div>
  )
}

export default App
