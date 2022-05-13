import React, {Fragment, useEffect, useState} from "react";

const apiKey = "1c586c3bff99e563d840c3c9528b2a52";
const apiUrl = "https://api.themoviedb.org/3";

const App = () => {
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  // Ajout de loader
  useEffect(() => {
    fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`).then(response => {
      if (response.status === 200) {
        return response.json();
      }

      if (response.status === 401) {
        return Promise.reject(new Error("API Key forgotten"));
      }

      if (response.status === 404) {
        return Promise.reject(new Error("Bad route"));
      }

    }).then(response => {
      setMovies(response.results);
    }).catch(error => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    });
  },[]);

  return (
    <Fragment>
      <span>... is Loading</span>
    {error && <small>{error}</small>}      
    <h2>Movies to watch</h2>
      <ul>
        {movies && movies.map((movie) => (
          <li key={movie.id} onClick={moveToSeen(movie)}>{movie.title}</li>
        ))}
      </ul>
    </Fragment>
  );
};

export default App;
