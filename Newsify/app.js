const apiKey = '99f2a21c2dbb41f295a13c185cddcb17';

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');



async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

// searchButton.addEventListener("click",  async ()=> {
//     const query = searchField.value.trim()
//     if(query !== ""){
//         try{
//             const articles =  await fetchNewsQuery
//             (query)
//             displayBlogs(articles)
//         }catch(error){
//             console.log("Error fetching news by query", error)
//         }
//     }
// })

// Trigger search
async function triggerSearch() {
    const query = searchField.value.trim();
    if (query) {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by query", error);
        }
    }
}

// Search button click event
searchButton.addEventListener("click", triggerSearch);

// "Enter" key event on search field
searchField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        triggerSearch();
    }
});

// Load initial random news
(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error displaying blogs", error);
    }
})();

async function fetchNewsQuery(query){
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=50&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";
    articles.forEach(article => { // Fixed the arrow function syntax here
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage;
        img.alt = article.title;

        const title = document.createElement("h2");
        const truncatedTitle = 
        article.title.length > 30
            ? article.title.slice(0, 30)+ "...."
            : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = 
        article.description.length > 120
            ? article.title.slice(0, 120)+ "...."
            : article.title;
        description.textContent = truncatedDes;
        

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener('click', ()=> {
            window.open(article.url , "_blank");
        });
        blogContainer.appendChild(blogCard);
    });
}

(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error displaying blogs", error);
    }
})();


 // Get the button
 const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    
 // Show the button when scrolling down 20px from the top
 window.onscroll = function() {
     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
         scrollToTopBtn.style.display = "flex";
     } else {
         scrollToTopBtn.style.display = "none";
     }
 };
 
 // Scroll to top function
 scrollToTopBtn.onclick = function() {
     window.scrollTo({
         top: 0,
         behavior: "smooth" // Smooth scroll effect
     });
 };

 function toggleSidebar() {
    const sidebar = document.querySelector('.social-sidebar');
    const arrow = document.querySelector('.toggle-arrow');

    if (sidebar.style.display === 'none' || !sidebar.style.display) {
        sidebar.style.display = 'flex'; // Show sidebar
        arrow.style.display = 'none'; // Hide arrow
    } else {
        sidebar.style.display = 'none'; // Hide sidebar
        arrow.style.display = 'block'; // Show arrow
    }
}

// Initialize sidebar to be visible on page load
document.querySelector('.social-sidebar').style.display = 'flex';