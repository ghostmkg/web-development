const searchBox = document.querySelector('#searchBox');
const searchBtn = document.querySelector('#searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const categoryFilter = document.querySelector('#categoryFilter');
const areaFilter = document.querySelector('#areaFilter');

// Initialize filters
const initializeFilters = async () => {
    try {
        // Fetch categories
        const categoryData = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const categories = await categoryData.json();
        categories.meals.forEach(category => {
            const option = document.createElement('option');
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categoryFilter.appendChild(option);
        });

        // Fetch areas
        const areaData = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const areas = await areaData.json();
        areas.meals.forEach(area => {
            const option = document.createElement('option');
            option.value = area.strArea;
            option.textContent = area.strArea;
            areaFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
};

// Function to fetch random recipes
const fetchRandomRecipes = async () => {
    try {
        recipeContainer.innerHTML = "<h2>Loading delicious recipes...</h2>";
        let recipes = [];
        
        // Fetch 8 random recipes
        for (let i = 0; i < 8; i++) {
            const data = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const response = await data.json();
            if (response.meals && response.meals[0]) {
                recipes.push(response.meals[0]);
            }
        }

        recipeContainer.innerHTML = '';
        
        recipes.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });
            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error('Error fetching random recipes:', error);
        recipeContainer.innerHTML = '<h2>Failed to load recipes. Please try refreshing the page.</h2>';
    }
};

// Initialize filters and load random recipes when page loads
initializeFilters();
fetchRandomRecipes();

const fetchRecipes = async (query) => {
    try {
        recipeContainer.innerHTML = "<h2>Hold back! We're getting the recipes for you...</h2>";
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        // Clear previous results
        recipeContainer.innerHTML = '';

        if (response.meals) {
            const selectedCategory = categoryFilter.value;
            const selectedArea = areaFilter.value;
            
            const filteredMeals = response.meals.filter(meal => {
                const categoryMatch = !selectedCategory || meal.strCategory === selectedCategory;
                const areaMatch = !selectedArea || meal.strArea === selectedArea;
                return categoryMatch && areaMatch;
            });

            if (filteredMeals.length === 0) {
                recipeContainer.innerHTML = '<h2>No recipes found matching the selected filters.</h2>';
                return;
            }

            filteredMeals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = '<p>No recipes found. Please try another search.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<p>There was an error fetching the recipes. Please try again later.</p>';
    }
};

const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    
    recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Function to handle search
const handleSearch = () => {
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = '<h2>Please enter a search term.</h2>';
    }
};

// Event listeners for interactive search
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSearch();
});

searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
});

// Add event listeners for filters
categoryFilter.addEventListener('change', () => {
    if (searchBox.value.trim()) {
        handleSearch();
    }
});

areaFilter.addEventListener('change', () => {
    if (searchBox.value.trim()) {
        handleSearch();
    }
});
