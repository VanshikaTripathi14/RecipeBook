// Recipe Book Application
// This app allows users to add, view, search, edit, and delete recipes
// All data is stored in the browser's localStorage

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addRecipeForm = document.getElementById('addRecipeForm');
    const recipeNameInput = document.getElementById('recipeName');
    const recipeIngredientsInput = document.getElementById('recipeIngredients');
    const recipeStepsInput = document.getElementById('recipeSteps');
    const recipeImageInput = document.getElementById('recipeImage');
    const imagePreview = document.getElementById('imagePreview');
    const saveRecipeBtn = document.getElementById('saveRecipeBtn'); // Changed ID
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const recipesContainer = document.getElementById('recipesContainer');
    const recipeModal = document.getElementById('recipeModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close');

    // Line 20: New DOM elements for confirmation modal
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeConfirmModal = document.querySelector('.close-confirm');

    // Line 25: Variable to store the ID of the recipe being edited or deleted
    let editingRecipeId = null;
    let recipeIdToDelete = null;

    // Event Listeners
    addRecipeForm.addEventListener('submit', handleSaveRecipe); // Changed function name
    searchBtn.addEventListener('click', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    closeModal.addEventListener('click', () => recipeModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === recipeModal) {
            recipeModal.style.display = 'none';
        }
        // Line 36: Close confirmation modal if clicked outside
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    recipeImageInput.addEventListener('change', handleImageUpload);

    // Line 43: Event listeners for confirmation modal buttons
    confirmDeleteBtn.addEventListener('click', confirmDeletion);
    cancelDeleteBtn.addEventListener('click', () => confirmationModal.style.display = 'none');
    closeConfirmModal.addEventListener('click', () => confirmationModal.style.display = 'none');


    // Load recipes when page loads
    loadRecipes();

    // Line 52: Renamed from handleAddRecipe to handleSaveRecipe
    function handleSaveRecipe(e) {
        e.preventDefault();
        
        // Validate form
        if (!recipeNameInput.value.trim() || !recipeIngredientsInput.value.trim() || !recipeStepsInput.value.trim()) {
            // Line 58: Replaced alert with console.error as alerts are not allowed
            console.error('Please fill in all required fields');
            // In a real app, you'd show a custom message box here
            return;
        }

        // Create recipe object
        const recipe = {
            name: recipeNameInput.value.trim(),
            ingredients: recipeIngredientsInput.value.trim().split('\n').filter(ing => ing.trim()),
            steps: recipeStepsInput.value.trim().split('\n').filter(step => step.trim()),
            image: imagePreview.querySelector('img')?.src || ''
        };

        if (editingRecipeId) {
            // Line 72: Update existing recipe
            updateRecipe(editingRecipeId, recipe);
        } else {
            // Line 75: Add new recipe
            recipe.id = Date.now().toString(); // Assign new ID only for new recipes
            saveRecipe(recipe);
        }
        
        // Reset form and UI state
        addRecipeForm.reset();
        imagePreview.innerHTML = '';
        editingRecipeId = null; // Clear editing state
        saveRecipeBtn.textContent = 'Add Recipe'; // Reset button text
        
        // Reload recipes
        loadRecipes();
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            // Line 93: Replaced alert with console.error
            console.error('Please select an image file');
            // In a real app, you'd show a custom message box here
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="object-fit: contain;">`;
        };
        reader.readAsDataURL(file);
    }

    function saveRecipe(recipe) {
        let recipes = getRecipes();
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    // Line 112: New function to update a recipe
    function updateRecipe(id, updatedRecipe) {
        let recipes = getRecipes();
        const index = recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            recipes[index] = { ...recipes[index], ...updatedRecipe }; // Merge existing with updated data
            localStorage.setItem('recipes', JSON.stringify(recipes));
        }
    }

    function getRecipes() {
        return JSON.parse(localStorage.getItem('recipes')) || [];
    }

    function loadRecipes(recipes = null) {
        const recipesToDisplay = recipes || getRecipes();
        recipesContainer.innerHTML = '';

        if (recipesToDisplay.length === 0) {
            recipesContainer.innerHTML = '<p>No recipes found. Add a recipe to get started!</p>';
            return;
        }

        recipesToDisplay.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : '<div class="no-image">No Image Available</div>'}
                <div class="recipe-card-content">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.ingredients.length} ingredients</p>
                </div>
                <!-- Line 148: Add action buttons for edit and delete -->
                <div class="recipe-card-actions">
                    <button class="action-btn edit" data-id="${recipe.id}" title="Edit Recipe">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${recipe.id}" title="Delete Recipe">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            // Line 159: Changed click listener to viewRecipe only, actions handled by new buttons
            recipeCard.querySelector('.recipe-card-content').addEventListener('click', () => viewRecipe(recipe.id));
            recipeCard.querySelector('.recipe-card-actions .edit').addEventListener('click', (e) => handleEditRecipe(e, recipe.id));
            recipeCard.querySelector('.recipe-card-actions .delete').addEventListener('click', (e) => handleDeleteClick(e, recipe.id));
            recipesContainer.appendChild(recipeCard);
        });
    }

    function viewRecipe(recipeId) {
        const recipes = getRecipes();
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        modalContent.innerHTML = `
            ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="modal-recipe-image">` : ''}
            <h2>${recipe.name}</h2>
            
            <div class="modal-section">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>Preparation Steps</h3>
                <ol>
                    ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        `;

        recipeModal.style.display = 'block';
    }

    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            loadRecipes();
            return;
        }

        const recipes = getRecipes();
        const filteredRecipes = recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) || 
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
        );

        loadRecipes(filteredRecipes);
    }

    function clearSearch() {
        searchInput.value = '';
        loadRecipes();
    }

    // Line 213: New function to handle edit button click
    function handleEditRecipe(e, recipeId) {
        e.stopPropagation(); // Prevent recipe card click event from firing
        const recipes = getRecipes();
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        // Populate the form with recipe data
        recipeNameInput.value = recipe.name;
        recipeIngredientsInput.value = recipe.ingredients.join('\n');
        recipeStepsInput.value = recipe.steps.join('\n');
        if (recipe.image) {
            imagePreview.innerHTML = `<img src="${recipe.image}" alt="Preview" style="object-fit: contain;">`;
        } else {
            imagePreview.innerHTML = '';
        }

        // Set editing state
        editingRecipeId = recipeId;
        saveRecipeBtn.textContent = 'Update Recipe'; // Change button text

        // Scroll to the form
        addRecipeForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Line 239: New function to handle delete button click
    function handleDeleteClick(e, recipeId) {
        e.stopPropagation(); // Prevent recipe card click event from firing
        recipeIdToDelete = recipeId; // Store the ID of the recipe to be deleted
        confirmationModal.style.display = 'block'; // Show the confirmation modal
    }

    // Line 246: New function to confirm deletion
    function confirmDeletion() {
        if (recipeIdToDelete) {
            deleteRecipe(recipeIdToDelete);
            confirmationModal.style.display = 'none'; // Hide the confirmation modal
            recipeIdToDelete = null; // Clear the stored ID
            loadRecipes(); // Reload recipes after deletion
        }
    }

    // Line 255: New function to delete a recipe
    function deleteRecipe(id) {
        let recipes = getRecipes();
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
});