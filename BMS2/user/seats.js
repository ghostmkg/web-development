// seats.js
document.addEventListener('DOMContentLoaded', async function() {
    // auth.js should handle initial redirection if not logged in.
    // A small delay to ensure auth.js has a chance to run its DOMContentLoaded and check status.
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    // Re-check status (optional, auth.js should cover this by redirecting from protectedPages)
    // if (typeof checkLoginStatus === 'function') {
    //     const loginStatus = await checkLoginStatus();
    //     if (!loginStatus.isLoggedIn && window.location.pathname.includes('seats.html')) {
    //         console.log("[SEATS.JS] Not logged in, redirecting.");
    //         window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    //         return; 
    //     }
    // } else {
    //     console.warn("[SEATS.JS] checkLoginStatus function not found. Ensure auth.js is loaded before seats.js if relying on it here.");
    // }


    const urlParams = new URLSearchParams(window.location.search);
    const movieIdFromUrl = urlParams.get('movie_id') || "UNKNOWN_MOVIE_ID";
    const movieNameFromUrl = urlParams.get('movie_name') || "Unknown Movie";
    const showTimeFromUrl = urlParams.get('show_time') || "Unknown Time";

    // Populate movie details in header
    const movieIdInput = document.querySelector('input[name="movie_id"]');
    if (movieIdInput) movieIdInput.value = movieIdFromUrl; 
    const movieNameSpan = document.getElementById('movie-name');
    if (movieNameSpan) movieNameSpan.textContent = movieNameFromUrl;
    const movieDetailsParagraph = movieNameSpan ? movieNameSpan.parentElement : null;
    if (movieDetailsParagraph && showTimeFromUrl !== "Unknown Time") { 
        let sd = document.getElementById('show-time-display');
        if(!sd) { sd = document.createElement('span'); sd.id = 'show-time-display'; movieDetailsParagraph.appendChild(sd); }
        sd.innerHTML = ` | Showtime: <span id="show-time-value">${showTimeFromUrl}</span>`;
    }

    const seatElements = document.querySelectorAll('.seat-selection .seat');
    let selectedSeats = [];

    async function markBookedSeats() {
        if (movieIdFromUrl === "UNKNOWN_MOVIE_ID" || showTimeFromUrl === "Unknown Time") {
            console.warn("[SEATS.JS] Movie ID or Showtime unknown, cannot fetch booked seats.");
            seatElements.forEach(seatEl => { seatEl.disabled = false; seatEl.classList.remove('occupied'); }); // Ensure seats are enabled
            return;
        }
        
        const encodedShowTime = encodeURIComponent(showTimeFromUrl);

        try {
            console.log(`[SEATS.JS] Fetching booked seats for Movie ID: ${movieIdFromUrl}, Showtime: ${showTimeFromUrl} (encoded for URL: ${encodedShowTime})`);
            // Ensure API URL uses 127.0.0.1 to match Flask host
            const response = await fetch(`http://127.0.0.1:5000/api/movies/${movieIdFromUrl}/showtimes/${encodedShowTime}/booked-seats`, {
                method: 'GET', 
                credentials: 'include' // Good practice even if endpoint isn't strictly @login_required
            });

            console.log("[SEATS.JS] Booked seats fetch status:", response.status);

            if (!response.ok) {
                let errorMsg = `Failed to fetch booked seats. Status: ${response.status}`;
                try { const errRes = await response.json(); errorMsg = errRes.message || errorMsg; } catch(e){}
                throw new Error(errorMsg);
            }

            const bookedSeatIds = await response.json(); 
            console.log("[SEATS.JS] Received booked seats:", bookedSeatIds);

            if (Array.isArray(bookedSeatIds)) {
                seatElements.forEach(seatEl => {
                    const seatId = seatEl.textContent;
                    if (bookedSeatIds.includes(seatId)) {
                        seatEl.classList.add('occupied'); 
                        seatEl.classList.remove('selected'); 
                        seatEl.disabled = true; 
                        // console.log(`[SEATS.JS] Seat ${seatId} marked occupied.`);
                    } else {
                        seatEl.classList.remove('occupied'); 
                        seatEl.disabled = false;
                    }
                });
            }
        } catch (error) {
            console.error('[SEATS.JS] Error fetching or marking booked seats:', error);
            alert("Could not load current seat availability. Please try refreshing. " + error.message);
            // Make all seats appear available as a fallback, or disable all
            seatElements.forEach(seatEl => { seatEl.disabled = false; seatEl.classList.remove('occupied'); });
        }
    }

    await markBookedSeats(); // Call when page loads

    seatElements.forEach(seat => {
        seat.addEventListener('click', function() {
            if (this.disabled) return; // Check if seat is disabled (e.g., occupied)
            this.classList.toggle('selected');
            const seatId = this.textContent;
            if (this.classList.contains('selected')) {
                if (!selectedSeats.includes(seatId)) selectedSeats.push(seatId);
            } else {
                selectedSeats = selectedSeats.filter(s => s !== seatId);
            }
            console.log("[SEATS.JS] Currently selected seats:", selectedSeats);
        });
    });

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const userNameInput = document.querySelector('input[name="user_name"]');
            const bookingUserName = (userNameInput && userNameInput.value.trim()) ? userNameInput.value.trim() : 'Guest Booking';

            if (userNameInput && !userNameInput.value.trim()) { 
                alert('Please enter a name for this booking.'); userNameInput.focus(); return;
            }
            if (selectedSeats.length === 0) {
                alert('Please select at least one seat.'); return;
            }

            // Optional: Re-check selected seats against newly fetched occupied seats before submitting
            // This is an advanced feature to prevent race conditions. For now, we rely on initial load.

            const bookingData = { 
                movieId: movieIdFromUrl, movieName: movieNameFromUrl, showTime: showTimeFromUrl,   
                userName: bookingUserName, seats: selectedSeats.sort()
            };
            console.log("[SEATS.JS] Sending bookingData for POST:", JSON.stringify(bookingData, null, 2));
            try {
                const response = await fetch('http://127.0.0.1:5000/api/bookings', { // Ensure API URL uses 127.0.0.1
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                    credentials: 'include' // Crucial for @login_required on backend
                });
                const result = await response.json();
                if (!response.ok) { 
                    if (response.status === 401) { 
                        alert(result.message || "Authentication error. Please log in again."); 
                        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search); 
                        return;
                    }
                    throw new Error(result.message || `HTTP error! status: ${response.status}`);
                }
                console.log("[SEATS.JS] Booking successful, server response:", result);
                alert(`Booking Confirmed!\nMovie: ${bookingData.movieName}\nShowtime: ${bookingData.showTime}\nSeats: ${selectedSeats.join(', ')}\nBooking ID: ${result.bookingId}`);
                window.location.href = 'my_bookings.html'; // Redirect to list of user's bookings
            } catch (error) {
                console.error('[SEATS.JS] Failed to create booking:', error);
                alert(`Failed to create booking: ${error.message}.`);
            }
        });
    }
});