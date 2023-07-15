// Get the imdbID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('id');

// Declare variables for movie details
let movieTitle;
let movieGenre;
let movieDirector;
let moviePlot;
let movieRating;

// Function to fetch movie details by imdbID
async function fetchMovieDetails(imdbID) {
  const url = `https://www.omdbapi.com/?apikey=fa362c73&i=${encodeURIComponent(imdbID)}&plot=full`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Function to display movie details in the UI
function displayMovieDetails(movie) {
  const header = document.getElementById('header');
  const moviePosterContainer = document.getElementById('moviePoster');
  const movieDetailsContainer = document.getElementById('movieDetails');
  const castAndCrewList = document.getElementById('castAndCrewList');

  if (movie) {
    header.style.backgroundImage = `url('${movie.Poster}')`;

    moviePosterContainer.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title} Poster" width="300">
    `;

    movieDetailsContainer.innerHTML = `
      <h2>${movie.Title} (${movie.Year})</h2>
      <br><br>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <br><br>
      <p><strong>IMDb ID:</strong> ${movie.imdbID}</p>
      <br><br>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <br><br>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <br><br>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
    `;

    // Update the movie details variables
    movieTitle = movie.Title;
    movieGenre = movie.Genre;
    movieDirector = movie.Director;
    moviePlot = movie.Plot;
    movieRating = movie.imdbRating;

    // Display cast and crew
    if (movie.Actors) {
      const actors = movie.Actors.split(', ');
      actors.forEach(actor => {
        const listItem = document.createElement('li');
        listItem.textContent = actor;
        castAndCrewList.appendChild(listItem);
      });
    }

    // Enable the "Add to Watchlist" button
    addToWatchlistButton.disabled = false;
  } else {
    movieDetailsContainer.innerHTML = '<p>Movie details not found.</p>';
  }
}

// Fetch and display movie details
fetchMovieDetails(imdbID)
  .then((movie) => {
    displayMovieDetails(movie);
  })
  .catch((error) => {
    console.error('Error:', error);
    displayMovieDetails(null);
  });

// Add event listener to "Add to Watchlist" button
const addToWatchlistButton = document.getElementById('addToWatchlistButton');
addToWatchlistButton.addEventListener('click', addToWatchlist);

// Function to add movie to the watchlist
function addToWatchlist() {
  // Create an object to store the movie details
  const movie = {
    title: movieTitle,
    ID: imdbID,
    genre: movieGenre,
    director: movieDirector,
    plot: moviePlot,
    rating: movieRating,
    poster: document.querySelector('#moviePoster img').src // Add the poster property
  };

  // Save the movie object to local storage
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist.push(movie);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));

  // Redirect to the watchlist page
  window.location.href = 'watchlist.html';
}

// Add event listener to back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
  window.history.back();
});
