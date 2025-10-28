// admin_script.js with Final Debugging & Chart Fixes

const ADMIN_API_BASE = 'http://127.0.0.1:5001/admin-api';
// ... (all existing element consts are the same)
const loginSectEl = document.getElementById('loginSection');
const dashboardContEl = document.getElementById('dashboardContent');
const adminMsgDivEl = document.getElementById('adminMessage');
const authSectDivEl = document.querySelector('.admin-auth-section');
const editModalEl = document.getElementById('editMovieModal');
const editFormEl = document.getElementById('editMovieForm');
const moviesListContEl = document.getElementById('movieListContainer');
const statsTotalMoviesSpan = document.getElementById('statsTotalMovies');
const statsTotalUsersSpan = document.getElementById('statsTotalUsers');
const statsTotalBookingsSpan = document.getElementById('statsTotalBookings');
const bookingInsightsNavContainerEl = document.getElementById('bookingInsightsNavContainer');
const bookingInsightDisplayAreaEl = document.getElementById('bookingInsightDisplayArea');

let allMoviesDataCacheArr = [];
let currentActiveAdminSectionId = 'dashboard-overview-section';
let activeCharts = []; // To manage chart instances

function escHtml(unsafe) { /* ... same as before ... */ if (unsafe === null || unsafe === undefined) return ''; return String(unsafe).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/'/g, "'"); }
function showAdminMsg(message, isError = false) { /* ... same as before ... */ if (!adminMsgDivEl) return; adminMsgDivEl.textContent = message; adminMsgDivEl.className = isError ? 'message error' : 'message success'; adminMsgDivEl.style.display = 'block'; setTimeout(() => { if (adminMsgDivEl) { adminMsgDivEl.style.display = 'none'; } }, 4000); }
function updateAdminNavUI(isLoggedIn, username = '') { if (!authSectDivEl) return; if (isLoggedIn) { authSectDivEl.innerHTML = `<span style="color: #e0e0e0;">Admin: ${escHtml(username)}</span> <button id="adminLogoutBtnEl">Logout</button>`; const logoutBtn = document.getElementById('adminLogoutBtnEl'); if (logoutBtn) logoutBtn.addEventListener('click', handleAdminLogout); } else { authSectDivEl.innerHTML = `<span>(Not Logged In as Admin)</span>`; } }
async function checkAdminLoginStatus() { try { const resp = await fetch(`${ADMIN_API_BASE}/auth/status`, { credentials: 'include' }); const data = await resp.json(); updateAdminNavUI(data.isAdminLoggedIn, data.adminUsername); if (data.isAdminLoggedIn) { if (loginSectEl) loginSectEl.style.display = 'none'; if (dashboardContEl) dashboardContEl.style.display = 'block'; } else { if (loginSectEl) loginSectEl.style.display = 'block'; if (dashboardContEl) dashboardContEl.style.display = 'none'; } return data.isAdminLoggedIn; } catch (err) { updateAdminNavUI(false); if (loginSectEl) loginSectEl.style.display = 'block'; if (dashboardContEl) dashboardContEl.style.display = 'none'; return false; } }
async function handleAdminLogout() { try { const resp = await fetch(`${ADMIN_API_BASE}/logout`, { method: 'POST', credentials: 'include' }); const res = await resp.json(); showAdminMsg(res.message || "Logged out.", false); await checkAdminLoginStatus(); window.location.hash = ''; } catch (err) { showAdminMsg("Error during logout.", true); } }
async function loadDashboardStats() { if (!statsTotalMoviesSpan || !statsTotalUsersSpan || !statsTotalBookingsSpan) return; statsTotalMoviesSpan.textContent = '...'; statsTotalUsersSpan.textContent = '...'; statsTotalBookingsSpan.textContent = '...'; try { const response = await fetch(`${ADMIN_API_BASE}/stats`, { credentials: 'include' }); if (!response.ok) throw new Error('Failed to fetch stats'); const statsData = await response.json(); if (statsTotalMoviesSpan) statsTotalMoviesSpan.textContent = statsData.totalMovies ?? 'Error'; if (statsTotalUsersSpan) statsTotalUsersSpan.textContent = statsData.totalUsers ?? 'Error'; if (statsTotalBookingsSpan) statsTotalBookingsSpan.textContent = statsData.totalBookings ?? 'Error'; } catch (error) { if (statsTotalMoviesSpan) statsTotalMoviesSpan.textContent = 'Error'; if (statsTotalUsersSpan) statsTotalUsersSpan.textContent = 'Error'; if (statsTotalBookingsSpan) statsTotalBookingsSpan.textContent = 'Error'; } }

// --- FIXED: loadMoviesAdmin to correctly display showtimes ---
async function loadMoviesAdmin() {
    if (!moviesListContEl) return;
    moviesListContEl.innerHTML = '<p>Loading movies...</p>';
    try {
        const resp = await fetch(`${ADMIN_API_BASE}/movies`, { credentials: 'include' });
        if (!resp.ok) throw new Error('Failed to load movies');
        allMoviesDataCacheArr = await resp.json();
        if (allMoviesDataCacheArr.length === 0) {
            moviesListContEl.innerHTML = '<p>No movies found. Add one below!</p>';
            return;
        }
        let tableHTML = `<table><thead><tr><th>ID</th><th>Title</th><th>Duration</th><th>Poster</th><th>Default?</th><th>Showtimes</th><th>Actions</th></tr></thead><tbody>`;
        allMoviesDataCacheArr.forEach(m => {
            // Correctly map over the showtimes array of objects
            const showtimesText = m.showtimes && m.showtimes.length > 0
                ? m.showtimes.map(st => escHtml(st.time)).join(', ')
                : 'None';
            tableHTML += `<tr data-movie-id="${m.id}">
                            <td>${m.id}</td>
                            <td>${escHtml(m.title)}</td>
                            <td>${escHtml(m.duration)}</td>
                            <td>${escHtml(m.poster_image_filename)}</td>
                            <td>${m.is_default ? 'Yes' : 'No'}</td>
                            <td>${showtimesText}</td>
                            <td>
                                <button class="small-action-btn edit-btn" data-action="edit">Edit</button>
                                ${!m.is_default ? `<button class="small-action-btn delete-btn" data-action="delete">Delete</button>` : ''}
                            </td>
                          </tr>`;
        });
        tableHTML += `</tbody></table>`;
        moviesListContEl.innerHTML = tableHTML;
    } catch (err) {
        moviesListContEl.innerHTML = `<p class="message error">Error loading movies: ${err.message}</p>`;
    }
}

function openEditModalAdmin(movie) { if (!editFormEl || !editModalEl) return; document.getElementById('editMovieId').value = movie.id; document.getElementById('editMovieTitle').value = movie.title; document.getElementById('editMovieDuration').value = movie.duration; document.getElementById('editMoviePoster').value = movie.poster_image_filename; document.getElementById('editIsDefaultStatus').textContent = movie.is_default ? "Yes" : "No"; document.getElementById('editDefaultMessage').textContent = movie.is_default ? "Default status cannot be changed." : "User-added movie."; document.getElementById('editMovieShowtimes').value = movie.showtimes.map(st => st.time).join(', '); editModalEl.style.display = 'block'; }
function closeEditModalAdmin() { if (editModalEl) editModalEl.style.display = 'none'; }
async function deleteMovieAdmin(id, title) { if (confirm(`Delete "${escHtml(title)}"?`)) { try { const resp = await fetch(`${ADMIN_API_BASE}/movies/${id}`, { method: 'DELETE', credentials: 'include' }); const res = await resp.json(); if (resp.ok) { showAdminMsg(res.message, false); setActiveAdminSection('manage-movies-section'); } else { showAdminMsg(res.message, true); } } catch (err) { showAdminMsg(`Network error`, true); } } }


function destroyActiveCharts() {
    activeCharts.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
    activeCharts = [];
}

function showMainInsightMenu() {
    destroyActiveCharts();
    if (bookingInsightsNavContainerEl) bookingInsightsNavContainerEl.style.display = 'grid';
    if (bookingInsightDisplayAreaEl) bookingInsightDisplayAreaEl.innerHTML = '<p style="text-align: center; color: #aaa; font-style: italic;">Select an insight from above to view details.</p>';
}

// Helper to generate a vibrant, dynamic color palette
function generateDistributedColors(numColors) {
    const colors = [];
    const baseHue = 15; // Start with orange/red
    for (let i = 0; i < numColors; i++) {
        // Use the golden angle for aesthetically pleasing color distribution
        const hue = (baseHue + i * 137.508) % 360;
        colors.push(`hsl(${hue}, 85%, 55%)`);
    }
    return colors;
}

function getBaseChartOptions() {
    return {
        chart: { background: 'transparent', foreColor: '#e0e0e0', animations: { easing: 'easeinout', speed: 600, animateGradually: { enabled: true, delay: 150 } } },
        theme: { mode: 'dark' },
        stroke: { show: true, width: 2, colors: ['#2a2a2a'] },
        legend: { position: 'bottom', horizontalAlign: 'center', fontWeight: 700, itemMargin: { horizontal: 10, vertical: 5 } },
        tooltip: { theme: 'dark', y: { formatter: (val) => val.toFixed(0) } },
        states: { hover: { filter: { type: 'lighten', value: 0.05 } }, active: { filter: { type: 'darken', value: 0.9 } } },
        plotOptions: { pie: { expandOnClick: true } }
    };
}

async function displayInsight(insightType) {
    if (!bookingInsightDisplayAreaEl || !bookingInsightsNavContainerEl) return;
    destroyActiveCharts();
    bookingInsightsNavContainerEl.style.display = 'none';
    bookingInsightDisplayAreaEl.innerHTML = '<p style-="text-align:center;color:#ccc">Loading...</p>';
    const template = document.getElementById(`template${insightType.charAt(0).toUpperCase() + insightType.slice(1)}`);
    if (!template) { bookingInsightDisplayAreaEl.innerHTML = `<p class="message error">Template not found.</p>`; return; }
    bookingInsightDisplayAreaEl.innerHTML = '';
    bookingInsightDisplayAreaEl.appendChild(template.content.cloneNode(true));
    bookingInsightDisplayAreaEl.querySelector('.back-to-insights-btn')?.addEventListener('click', showMainInsightMenu);

    try {
        switch (insightType) {
            case 'overallStats': await populateOverallStats(); break;
            case 'userActivity': await populateUserActivity(); break;
            case 'moviePopularity': await populateMoviePopularity(); break;
            case 'cancellationPatterns': await populateCancellationPatterns(); break;
            case 'allBookingsList': await populateAllBookingsList(); break;
        }
    } catch (error) { bookingInsightDisplayAreaEl.innerHTML += `<p class="message error">Failed to load: ${error.message}</p>`; }
}

async function populateOverallStats() {
    const [statsRes, popularRes] = await Promise.all([
        fetch(`${ADMIN_API_BASE}/bookings/stats/overall`, { credentials: 'include' }),
        fetch(`${ADMIN_API_BASE}/bookings/stats/movie-popularity`, { credentials: 'include' })
    ]);
    const statsData = await statsRes.json();
    const popularData = await popularRes.json();
    if (!statsRes.ok || !popularRes.ok) throw new Error("Failed to fetch overall stats data.");

    document.getElementById('tpl_bStatsActiveBookings').textContent = statsData.activeBookings ?? 'N/A';
    document.getElementById('tpl_bStatsTotalSeatsBooked').textContent = statsData.totalSeatsBooked ?? 'N/A';
    document.getElementById('tpl_bStatsUniqueMoviesBooked').textContent = statsData.uniqueMoviesBooked ?? 'N/A';
    document.getElementById('tpl_bStatsUniqueUsersBooking').textContent = statsData.uniqueUsersWithBookings ?? 'N/A';
    
    const topMovies = popularData.moviesBySalesActive.filter(m => m.tickets_sold > 0).slice(0, 5);
    const chartOptions = {
        ...getBaseChartOptions(),
        chart: { ...getBaseChartOptions().chart, type: 'donut', height: 380 },
        series: topMovies.map(m => m.tickets_sold),
        labels: topMovies.map(m => m.title),
        colors: generateDistributedColors(topMovies.length), // Reverted to dynamic colors
        plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: 'Top 5 Tickets', color: '#ffc107' } } } } }
    };
    const chart = new ApexCharts(document.querySelector("#chartOverallStats"), chartOptions);
    chart.render();
    activeCharts.push(chart);
}

async function populateUserActivity() {
    const response = await fetch(`${ADMIN_API_BASE}/bookings/stats/user-activity`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    document.getElementById('tpl_bStatsUserMostBookings').textContent = `${data.userWithMostActiveBookings.username} (${data.userWithMostActiveBookings.count})`;
    document.getElementById('tpl_bStatsUserMostCancels').textContent = `${data.userWithMostCancelledBookings.username} (${data.userWithMostCancelledBookings.count})`;
    document.getElementById('tpl_totalRegisteredUsersCount').textContent = data.totalRegisteredUsers ?? 'N/A';
    
    const userListContainer = document.getElementById('tpl_bStatsAllUsersListContainer');
    const searchInput = document.getElementById('userSearchInput');
    let allUsers = data.allRegisteredUsers || [];
    function renderUserList(usersToRender) {
        if (!userListContainer || usersToRender.length === 0) { userListContainer.innerHTML = '<p>No users found.</p>'; return; }
        let tableHTML = `<table><thead><tr><th>ID</th><th>Username</th><th>Registered On</th></tr></thead><tbody>`;
        usersToRender.forEach(user => { const regDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'; tableHTML += `<tr><td>${user.id}</td><td>${escHtml(user.username)}</td><td>${regDate}</td></tr>`; });
        tableHTML += `</tbody></table>`; userListContainer.innerHTML = tableHTML;
    }
    renderUserList(allUsers);
    if (searchInput) searchInput.onkeyup = () => { const searchTerm = searchInput.value.toLowerCase(); const filteredUsers = allUsers.filter(user => user.username.toLowerCase().includes(searchTerm) || String(user.id).includes(searchTerm)); renderUserList(filteredUsers); };

    const usersWithBookings = data.totalRegisteredUsers - data.usersWithNoBookingsCount;
    const chartOptions = {
        ...getBaseChartOptions(),
        chart: { ...getBaseChartOptions().chart, type: 'radialBar', height: 380 },
        series: [((usersWithBookings / data.totalRegisteredUsers) * 100).toFixed(1)],
        plotOptions: {
            radialBar: {
                hollow: { margin: 15, size: '70%' },
                dataLabels: { name: { offsetY: -10, fontSize: '22px' }, value: { color: '#fff', fontSize: '36px', show: true } }
            }
        },
        labels: ['Engaged Users'],
        colors: ['#3498db']
    };
    const chart = new ApexCharts(document.querySelector("#chartUserActivity"), chartOptions);
    chart.render();
    activeCharts.push(chart);
}

async function populateMoviePopularity() {
    const response = await fetch(`${ADMIN_API_BASE}/bookings/stats/movie-popularity`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    const chartData = data.moviesBySalesActive.filter(m => m.tickets_sold > 0);
    const chartOptions = {
        series: [{ name: 'Tickets Sold', data: chartData.map(m => m.tickets_sold) }],
        chart: { type: 'bar', height: 450 + (chartData.length * 10), background: 'transparent', foreColor: '#e0e0e0', animations: { speed: 500 } },
        plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: '70%', distributed: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: chartData.map(m => m.title), labels: { style: { fontWeight: 700 } } },
        yaxis: { labels: { style: { fontWeight: 700, fontSize: '14px' } } },
        tooltip: { theme: 'dark', y: { title: { formatter: () => 'Tickets' } } },
        grid: { borderColor: '#444' },
        colors: generateDistributedColors(chartData.length),
        legend: { show: false }
    };
    const chart = new ApexCharts(document.querySelector("#chartMoviePopularity"), chartOptions);
    chart.render();
    activeCharts.push(chart);
}

// --- FIXED: populateCancellationPatterns to fetch data correctly ---
async function populateCancellationPatterns() {
    const [cancelRes, statsRes] = await Promise.all([
        fetch(`${ADMIN_API_BASE}/bookings/stats/cancellation-patterns`, { credentials: 'include' }),
        fetch(`${ADMIN_API_BASE}/stats`, { credentials: 'include' })
    ]);
    const cancelData = await cancelRes.json();
    const statsData = await statsRes.json();
    if (!cancelRes.ok || !statsRes.ok) throw new Error("Failed to fetch cancellation data.");

    document.getElementById('tpl_bStatsTotalCancels').textContent = cancelData.totalCancelledBookings ?? 'N/A';
    document.getElementById('tpl_bStatsSeatsInCancels').textContent = cancelData.totalSeatsInCancelledBookings ?? 'N/A';
    document.getElementById('tpl_bStatsMovieMostCancels').textContent = `${cancelData.movieWithMostCancels.title} (${cancelData.movieWithMostCancels.count})`;
    document.getElementById('tpl_bStatsUserMostCancels').textContent = `${cancelData.userWithMostCancels.username} (${cancelData.userWithMostCancels.count})`;
    
    const chartOptions = {
        ...getBaseChartOptions(),
        chart: { ...getBaseChartOptions().chart, type: 'pie', height: 380 },
        series: [statsData.totalBookings, cancelData.totalCancelledBookings],
        labels: ['Active Bookings', 'Cancelled Bookings'],
        colors: ['#27ae60', '#e74c3c'],
        legend: { ...getBaseChartOptions().legend, markers: { fillColors: ['#27ae60', '#e74c3c'] } }
    };
    const chart = new ApexCharts(document.querySelector("#chartCancellationPatterns"), chartOptions);
    chart.render();
    activeCharts.push(chart);
}

async function populateAllBookingsList() {
    const contentElement = document.getElementById('bookingInsightDisplayArea');
    const tableContainer = contentElement.querySelector('#tpl_allBookingsTableContainer');
    const chartContainer = contentElement.querySelector('#chartBookingsByShowtime');
    
    async function fetchAndRenderAllData() {
        destroyActiveCharts();
        if (tableContainer) tableContainer.innerHTML = '<p>Fetching data...</p>';
        if (chartContainer) chartContainer.innerHTML = '';
        
        try {
            const [showtimeRes, bookingsRes] = await Promise.all([
                fetch(`${ADMIN_API_BASE}/bookings/stats/by-showtime`, { credentials: 'include' }),
                fetch(`${ADMIN_API_BASE}/bookings/all?${new URLSearchParams({
                    userId: contentElement.querySelector('#allBookingsFilterUser').value.trim(),
                    movieId: contentElement.querySelector('#allBookingsFilterMovie').value.trim(),
                    isCancelled: contentElement.querySelector('#allBookingsFilterCancelled').value
                }).toString()}`, { credentials: 'include' })
            ]);

            const showtimeData = await showtimeRes.json();
            const bookingsData = await bookingsRes.json();
            if (!showtimeRes.ok || !bookingsRes.ok) throw new Error("Failed to fetch booking data.");
            
            // Render Table
            if (!tableContainer) return; if (bookingsData.length === 0) { tableContainer.innerHTML = '<p>No bookings found.</p>'; } else { let tableHTML = `<table><thead><tr><th>ID</th><th>User</th><th>Movie</th><th>Show Time</th><th>Seats</th><th>Status</th></tr></thead><tbody>`; bookingsData.forEach(b => { tableHTML += `<tr style="${b.is_cancelled ? 'background-color:#583030;' : ''}"><td>${b.booking_id}</td><td>${escHtml(b.booked_by_username)}</td><td>${escHtml(b.movie_name)}</td><td>${escHtml(b.show_time)}</td><td>${b.seats.join(', ')}</td><td>${b.is_cancelled ? 'Cancelled' : 'Active'}</td></tr>`; }); tableHTML += `</tbody></table>`; tableContainer.innerHTML = tableHTML; }
            
            // Render "Bookings by Showtime" Area Chart
            const chartOptions = {
                series: [{ name: 'Active Bookings', data: showtimeData.map(d => d.booking_count) }],
                chart: { type: 'area', height: 350, background: 'transparent', foreColor: '#e0e0e0', toolbar: { show: false } },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                xaxis: { categories: showtimeData.map(d => d.show_time), labels: { style: { fontWeight: 700 } } },
                yaxis: { title: { text: 'Number of Bookings' } },
                grid: { borderColor: '#444' },
                colors: ['#ffc107'],
                fill: { type: 'gradient', gradient: { shade: 'dark', type: 'vertical', shadeIntensity: 0.5, gradientToColors: ['#333'], inverseColors: true, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 100] } }
            };
            const chart = new ApexCharts(chartContainer, chartOptions);
            chart.render();
            activeCharts.push(chart);

        } catch (error) { if (tableContainer) tableContainer.innerHTML = `<p class="message error">${error.message}</p>`; }
    }
    
    contentElement.querySelector('#allBookingsApplyFilterBtn')?.addEventListener('click', fetchAndRenderAllData);
    contentElement.querySelector('#allBookingsClearFilterBtn')?.addEventListener('click', () => {
        contentElement.querySelector('#allBookingsFilterUser').value = '';
        contentElement.querySelector('#allBookingsFilterMovie').value = '';
        contentElement.querySelector('#allBookingsFilterCancelled').value = '';
        fetchAndRenderAllData();
    });
    
    await fetchAndRenderAllData();
}

// --- Event Listeners and Page Navigation (Unchanged) ---
function setActiveAdminSection(sectionIdToShow) { destroyActiveCharts(); /* ... rest of function is the same */ if (!loginSectEl || !dashboardContEl) return; if (sectionIdToShow === 'loginSection') { loginSectEl.style.display = 'block'; dashboardContEl.style.display = 'none'; return; } const targetSection = document.getElementById(sectionIdToShow); if (!targetSection) return; loginSectEl.style.display = 'none'; dashboardContEl.style.display = 'block'; currentActiveAdminSectionId = sectionIdToShow; document.querySelectorAll('#dashboardContent > .admin-section').forEach(sec => sec.style.display = 'none'); targetSection.style.display = 'block'; document.querySelectorAll('.admin-nav a.nav-tab-link').forEach(link => link.classList.toggle('active', link.dataset.section === sectionIdToShow)); if (sectionIdToShow === 'dashboard-overview-section') loadDashboardStats(); else if (sectionIdToShow === 'manage-movies-section') loadMoviesAdmin(); else if (sectionIdToShow === 'manage-bookings-section') showMainInsightMenu(); }
if (document.getElementById('adminLoginForm')) { document.getElementById('adminLoginForm').addEventListener('submit', async function (e) { e.preventDefault(); const u = document.getElementById('adminUsernameInput').value, p = document.getElementById('adminPasswordInput').value; try { const resp = await fetch(`${ADMIN_API_BASE}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }), credentials: 'include' }); const res = await resp.json(); if (resp.ok) { showAdminMsg(res.message, false); await checkAdminLoginStatus(); window.location.hash = 'dashboard-overview-section'; } else { showAdminMsg(res.message, true); } } catch (err) { showAdminMsg("Network error", true); } }); }
if (moviesListContEl) { moviesListContEl.addEventListener('click', function (e) { const target = e.target.closest('button[data-action]'); if (!target) return; const row = target.closest('tr'); if (!row) return; const movie = allMoviesDataCacheArr.find(m => String(m.id) === row.dataset.movieId); if (!movie) return; if (target.dataset.action === 'edit') openEditModalAdmin(movie); else if (target.dataset.action === 'delete') deleteMovieAdmin(movie.id, movie.title); }); }
if (document.getElementById('addMovieForm')) { document.getElementById('addMovieForm').addEventListener('submit', async function (e) { e.preventDefault(); const title = document.getElementById('movieTitle').value, duration = document.getElementById('movieDuration').value, poster = document.getElementById('moviePoster').value, showtimes = document.getElementById('movieShowtimes').value.split(',').map(s => s.trim()).filter(Boolean); try { const resp = await fetch(`${ADMIN_API_BASE}/movies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, duration, poster_image_filename: poster, showtimes }), credentials: 'include' }); const res = await resp.json(); if (resp.ok) { showAdminMsg(res.message, false); this.reset(); setActiveAdminSection('manage-movies-section'); } else { showAdminMsg(res.message, true); } } catch (err) { showAdminMsg("Network error", true); } }); }
if (editFormEl) { editFormEl.addEventListener('submit', async function (e) { e.preventDefault(); const id = document.getElementById('editMovieId').value, title = document.getElementById('editMovieTitle').value, duration = document.getElementById('editMovieDuration').value, poster = document.getElementById('editMoviePoster').value, showtimes = document.getElementById('editMovieShowtimes').value.split(',').map(s => s.trim()).filter(Boolean); try { const resp = await fetch(`${ADMIN_API_BASE}/movies/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, duration, poster_image_filename: poster, showtimes }), credentials: 'include' }); const res = await resp.json(); if (resp.ok) { showAdminMsg(res.message, false); closeEditModalAdmin(); setActiveAdminSection('manage-movies-section'); } else { showAdminMsg(res.message, true); } } catch (err) { showAdminMsg("Network error", true); } }); }
document.querySelectorAll('.admin-nav a.nav-tab-link').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); if (link.dataset.section) window.location.hash = link.dataset.section; }));
if (bookingInsightsNavContainerEl) { bookingInsightsNavContainerEl.addEventListener('click', e => { const btn = e.target.closest('.insight-btn'); if (btn && btn.dataset.insight) displayInsight(btn.dataset.insight); }); }
window.addEventListener('hashchange', () => { const dashboardIsVisible = getComputedStyle(dashboardContEl).display !== 'none'; let sectionFromHash = window.location.hash.substring(1); if (dashboardIsVisible) { if (!sectionFromHash || !document.getElementById(sectionFromHash)) sectionFromHash = 'dashboard-overview-section'; setActiveAdminSection(sectionFromHash); } });
document.addEventListener('DOMContentLoaded', () => { checkAdminLoginStatus().then(loggedIn => { let targetSectionId = 'dashboard-overview-section'; if (loggedIn) { const hash = window.location.hash.substring(1); if (hash && document.getElementById(hash)) targetSectionId = hash; setActiveAdminSection(targetSectionId); } else { setActiveAdminSection('loginSection'); } }); });
if (document.getElementById('closeEditModalBtn')) document.getElementById('closeEditModalBtn').addEventListener('click', closeEditModalAdmin);
if (document.getElementById('cancelEditBtn')) document.getElementById('cancelEditBtn').addEventListener('click', closeEditModalAdmin);
window.onclick = e => { if (editModalEl && e.target == editModalEl) closeEditModalAdmin(); };