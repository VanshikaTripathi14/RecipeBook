// Recipe Book Application


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

    
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeConfirmModal = document.querySelector('.close-confirm');

    
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
        
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    recipeImageInput.addEventListener('change', handleImageUpload);

    
    confirmDeleteBtn.addEventListener('click', confirmDeletion);
    cancelDeleteBtn.addEventListener('click', () => confirmationModal.style.display = 'none');
    closeConfirmModal.addEventListener('click', () => confirmationModal.style.display = 'none');


    // Load recipes when page loads
    loadRecipes();

    
    function handleSaveRecipe(e) {
        e.preventDefault();
        
        // Validate form
        if (!recipeNameInput.value.trim() || !recipeIngredientsInput.value.trim() || !recipeStepsInput.value.trim()) {
            
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
            
            updateRecipe(editingRecipeId, recipe);
        } else {
            
            recipe.id = Date.now().toString(); // Assign new ID only for new recipes
            saveRecipe(recipe);
        }
        
        // Reset form and UI state
        addRecipeForm.reset();
        imagePreview.innerHTML = '';
        editingRecipeId = null; 
        saveRecipeBtn.textContent = 'Add Recipe'; 
        
        
        loadRecipes();
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            
            console.error('Please select an image file');
           
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

    
    function updateRecipe(id, updatedRecipe) {
        let recipes = getRecipes();
        const index = recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            recipes[index] = { ...recipes[index], ...updatedRecipe }; 
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

    
    function handleEditRecipe(e, recipeId) {
        e.stopPropagation(); 
        const recipes = getRecipes();
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        
        recipeNameInput.value = recipe.name;
        recipeIngredientsInput.value = recipe.ingredients.join('\n');
        recipeStepsInput.value = recipe.steps.join('\n');
        if (recipe.image) {
            imagePreview.innerHTML = `<img src="${recipe.image}" alt="Preview" style="object-fit: contain;">`;
        } else {
            imagePreview.innerHTML = '';
        }

        
        editingRecipeId = recipeId;
        saveRecipeBtn.textContent = 'Update Recipe'; 

        
        addRecipeForm.scrollIntoView({ behavior: 'smooth' });
    }

    
    function handleDeleteClick(e, recipeId) {
        e.stopPropagation(); 
        recipeIdToDelete = recipeId; 
        confirmationModal.style.display = 'block'; 
    }

    
    function confirmDeletion() {
        if (recipeIdToDelete) {
            deleteRecipe(recipeIdToDelete);
            confirmationModal.style.display = 'none'; 
            recipeIdToDelete = null; 
            loadRecipes(); 
        }
    }

    
    function deleteRecipe(id) {
        let recipes = getRecipes();
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
});