import React, {Fragment, useEffect, useState, useCallback} from "react";

const apiKey = "1c586c3bff99e563d840c3c9528b2a52";
const apiUrl = "https://api.themoviedb.org/3";

const App = () => {
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [seenMovies, setSeenMovies] = useState([]);

  const moveToSeen = useCallback((movie) => () => {
    setMovies(movies.filter(({id}) => id !== movie.id));
    setSeenMovies([...seenMovies, movie]);
  }, [seenMovies, movies]);

  const moveToUnseen = useCallback((movie) => () => {
    setMovies([...movies, movie]);
    setSeenMovies(seenMovies.filter(({id}) => id !== movie.id));
  }, [movies, seenMovies]);

  useEffect(() => {
    setError("");
    setMovies([]);

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

      return Promise.reject(new Error("Unknown error"));
    }).then(response => {
      setMovies(response.results);
    }).catch(error => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    });
  }, []);

  return (
    <Fragment>
      <small>{error}</small>
      <h2>Movies to watch</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id} onClick={moveToSeen(movie)}>{movie.title}</li>
        ))}
      </ul>
      <h2>Watched movies</h2>
      <ul>
        {seenMovies.map((seenMovie) => (
          <li key={seenMovie.id} onClick={moveToUnseen(seenMovie)}>{seenMovie.title}</li>
        ))}
      </ul>
    </Fragment>
  );
};

export default App;
