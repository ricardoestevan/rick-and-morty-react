import { useEffect, useRef, useState } from 'react';
import './App.css'
import useFetch from './hooks/useFetch'
import LocationData from './components/LocationData';
import ResidentCard from './components/ResidentCard';

function App() {
  const [inputValue, setInputValue] = useState(Math.floor(Math.random() * 126) + 1);
  const [location, getLocation, isLoading, hasError] = useFetch();
  const [currentPage, setCurrentPage] = useState(1);
  const residentsPerPage = 12;

  useEffect(() => {
    const url = `https://rickandmortyapi.com/api/location/${inputValue}`;
    getLocation(url);
  }, [inputValue]);

  const textInput = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newInputValue = textInput.current.value.toLowerCase().trim();
    if (!isNaN(newInputValue) && parseInt(newInputValue) > 0) {
      setInputValue(newInputValue);
    } else {
      console.log("expected input = numbers between 1-125");
    }
    textInput.current.value = "";
  };

  const pages = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const totalPages = Math.ceil(location?.residents.length / residentsPerPage);

  const indexOfLastResident = currentPage * residentsPerPage;
  const indexOfFirstResident = indexOfLastResident - residentsPerPage;
  const currentResidents = location?.residents.slice(indexOfFirstResident, indexOfLastResident);

  return (
    <>
      {isLoading ? (
        <h2>Loading...</h2>
        ) : (
        <div className='app'>
          <figure>
            <img className='app__img' src='/img/rickAndMorty.png' alt=""/>
          </figure>
          <form className='app__form' onSubmit={handleSubmit}>
            <input className='app__input' type="text" ref={textInput}/>
            <button className='app__btn'>Search</button>
          </form>
          {hasError || inputValue === '0' ? (
            <h2>Hey! you must provide an ID from 1 to 126</h2>
          ) : (
            <>
              <LocationData location={location} />
              {totalPages > 1 && (
                <div className='pagination'>
                  <button onClick={() => pages(currentPage - 1)}>Previous</button>
                  <span>{currentPage} of {totalPages}</span>
                  <button onClick={() => pages(currentPage + 1)}>Next</button>
                </div>
              )}
              <div className='app__container'>
                {currentResidents.map(resident => (
                  <ResidentCard key={resident} url={resident} />
                ))}
              </div>
              <div className='pagination'>
                  <button onClick={() => pages(currentPage - 1)}>Previous</button>
                  <span>{currentPage} of {totalPages}</span>
                  <button onClick={() => pages(currentPage + 1)}>Next</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default App;