import { useState, useEffect, useCallback } from 'react';
import Person from './Person';
import SearchForm from './SearchForm';
import './App.css';
import axios from 'axios';

function App() {
  const [people, setPeople] = useState([]);
  const [gender, setGender] = useState();
  const [country, setCountry] = useState('US');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const findPeople = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const url = `https://randomuser.me/api/?results=12&gender=${gender}&nat=${country}`;

    try {
      const response = await axios.get(url);
      setPeople(response.data.results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No se pudieron obtener los datos. Intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [gender, country]);

  useEffect(() => {
    const fetchData = async () => {
      await findPeople();
    };
    fetchData();
  }, [gender, country, findPeople]);

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleCountry = (event) => {
    setCountry(event.target.value);
  };

  return (
    <div className="App">
      <h1>Random People</h1>
      <div className="App-settings">
        <div>Gender: {gender || "all"}</div>
        <div>Country: {country}</div>
      </div>
      <SearchForm handleGender={handleGender} handleCountry={handleCountry} country={country} />
      <div className="App-button">
        <button onClick={findPeople} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search again'}
        </button>
      </div>
      {error && <p className="App-error">{error}</p>}
      <div className="App-people">
        {people.map((person) => (
          <Person key={person.login.uuid} person={person} />
        ))}
      </div>
    </div>
  );
}

export default App;
