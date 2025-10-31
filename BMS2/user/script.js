// script.js (for index.html)

async function fetchAndDisplayMovies() {
    const movieListingContainer = document.getElementById('movieListingContainer');
    if (!movieListingContainer) {
        console.error("Movie listing container not found!");
        return;
    }
    movieListingContainer.innerHTML = '<p class="loading-movies">Loading movies...</p>'; // Show loading message

    try {
        const response = await fetch('http://127.0.0.1:5000/api/movies-for-display', {
            method: 'GET',
        });
        console.log("[INDEX.JS] Fetch movies status:", response.status);

        if (!response.ok) {
            let errorMsg = "Could not fetch movies.";
            try { const errRes = await response.json(); errorMsg = errRes.message || errorMsg; } catch(e){}
            throw new Error(errorMsg);
        }

        const movies = await response.json();
        console.log("[INDEX.JS] Fetched movies:", movies);
        movieListingContainer.innerHTML = ''; // Clear loading message

        if (movies.length === 0) {
            movieListingContainer.innerHTML = '<p class="loading-movies">No movies currently available.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieBox = document.createElement('div');
            movieBox.className = 'movie-box';

            const posterPath = movie.poster ? movie.poster : 'placeholder.jpg'; 

            let showtimesHTML = '<p>No showtimes available.</p>';
            if (movie.showtimes && movie.showtimes.length > 0) {
                showtimesHTML = movie.showtimes.map(time => 
                    // Use data-* attributes instead of onclick
                    `<button class="time-btn" 
                             data-movie-id="${movie.id}" 
                             data-movie-name="${movie.title}" 
                             data-show-time="${time}">
                        ${time}
                     </button>`
                ).join('');
            }

            movieBox.innerHTML = `
                <div class="poster-wrapper">
                    <img src="${posterPath}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="duration">Duration: ${movie.duration || 'N/A'}</div>
                    <div class="showtimes">
                        ${showtimesHTML}
                    </div>
                </div>
            `;
            movieListingContainer.appendChild(movieBox);
        });

        // Add a single event listener to the container
        movieListingContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('time-btn')) {
                const button = event.target;
                const movieId = button.dataset.movieId;
                const movieName = button.dataset.movieName;
                const showTime = button.dataset.showTime;
                
                console.log(`[INDEX.JS] Book button clicked: MovieDB_ID=${movieId}, Name=${movieName}, Time=${showTime}`);
                const url = `seats.html?movie_id=${encodeURIComponent(movieId)}&movie_name=${encodeURIComponent(movieName)}&show_time=${encodeURIComponent(showTime)}`;
                window.location.href = url;
            }
        });

    } catch (error) {
        console.error('[INDEX.JS] Error fetching or displaying movies:', error);
        movieListingContainer.innerHTML = `<p class="loading-movies" style="color: red;">Error loading movies: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // auth.js will handle initial UI update for auth links.
    // Now, fetch and display movies.
    fetchAndDisplayMovies();
});