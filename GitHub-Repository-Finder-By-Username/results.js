document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (!username) {
        // Handle invalid URL
        console.error('Invalid URL. Please enter a GitHub username.');
        return;
    }

    const userContainer = $('#user');
    const repositoriesContainer = $('#repositories');
    const loader = $('#loader');
    const reposPerPageSelect = $('#reposPerPage');
    const searchRepoInput = $('#searchRepo');
    const paginationContainer = $('#pagination');
    const userAvatar = $('#userAvatar');
    const usernameElement = $('#username');

    // Variables to keep track of current page and total pages
    let currentPage = 1;
    let totalPages = 1;

    // Function to display loader
    function showLoader() {
        loader.show();
        repositoriesContainer.hide();
        paginationContainer.hide();
    }

    // Function to hide loader
    function hideLoader() {
        loader.hide();
        repositoriesContainer.show();
        paginationContainer.show();
    }

    // Function to fetch and display repositories
    function fetchAndDisplayRepositories() {
        showLoader();

        const reposPerPage = reposPerPageSelect.val();
        const searchQuery = searchRepoInput.val();

        // Fetch GitHub user details
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found or API request failed');
                }
                return response.json();
            })
            .then(user => {
                // Display user profile information
                userContainer.html(`
                    <div class="user-details">
                        <img src="${user.avatar_url}" alt="User Avatar" class="user-avatar">
                        <h3>${user.login}</h3>
                    </div>
                `);

                // Update user details in the header
                userAvatar.attr('src', user.avatar_url);
                usernameElement.text(user.login);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                userContainer.html('<p>Error fetching user details. Please try again later.</p>');
            });

        // Fetch GitHub repositories
        fetch(`https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${currentPage}`)
            .then(response => {
                // Extract pagination information from the response headers
                const linkHeader = response.headers.get('Link');
                if (linkHeader) {
                    const matches = linkHeader.match(/<([^>]+)>;\s*rel="last"/);
                    if (matches) {
                        totalPages = parseInt(matches[1].split('page=')[1]);
                    }
                }
                return response.json();
            })
            .then(repositories => {
                // Filter repositories based on the search query
                const filteredRepositories = repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));

                if (filteredRepositories.length === 0) {
                    repositoriesContainer.html('<p>No repositories found.</p>');
                } else {
                    repositoriesContainer.html('');
                    filteredRepositories.forEach(repo => {
                        const repoElement = $(`
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">${repo.name}</h5>
                                    <p class="card-text">${repo.description || 'No description'}</p>
                                    <a href="${repo.html_url}" target="_blank" class="btn btn-success">View on GitHub</a>
                                </div>
                            </div>
                        `);
                        repositoriesContainer.append(repoElement);

                        // Update pagination controls
                        updatePagination();
                    });
                }

                hideLoader();
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                repositoriesContainer.html('<p>Error fetching repositories. Please try again later.</p>');
                hideLoader();
            });
    }

    // Function to update pagination controls
    function updatePagination() {
        paginationContainer.html('');

        const maxDisplayedPages = Math.min(totalPages, 5); // Set the maximum number of displayed pages

        let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

        if (endPage - startPage < maxDisplayedPages - 1) {
            startPage = Math.max(1, endPage - maxDisplayedPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = $(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`);
            pageItem.on('click', () => {
                currentPage = i;
                fetchAndDisplayRepositories();
            });
            paginationContainer.append(pageItem);
        }
    }

    // Initial fetch and display
    fetchAndDisplayRepositories();

    // Event listeners for select and input changes
    reposPerPageSelect.on('change', () => {
        currentPage = 1;
        fetchAndDisplayRepositories();
    });

    searchRepoInput.on('input', () => {
        currentPage = 1;
        fetchAndDisplayRepositories();
    });
});
