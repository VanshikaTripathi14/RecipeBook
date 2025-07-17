document.addEventListener('DOMContentLoaded', function() {
    
    


    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(); // Firestore Database
    const storage = firebase.storage(); // Firebase Storage for images

    // --- 2. DOM Elements ---
    const getElem = (id) => document.getElementById(id);
    const addRecipeForm = getElem('addRecipeForm');
    const recipeNameInput = getElem('recipeName');
    const recipeIngredientsInput = getElem('recipeIngredients');
    const recipeStepsInput = getElem('recipeSteps');
    const recipeImageInput = getElem('recipeImage');
    const imagePreview = getElem('imagePreview');
    const saveRecipeBtn = getElem('saveRecipeBtn');
    const searchInput = getElem('searchInput');
    const clearSearchBtn = getElem('clearSearchBtn');
    const recipesContainer = getElem('recipesContainer');
    const recipeModal = getElem('recipeModal');
    const modalContent = getElem('modalContent');
    const confirmationModal = getElem('confirmationModal');
    const confirmDeleteBtn = getElem('confirmDeleteBtn');
    const cancelDeleteBtn = getElem('cancelDeleteBtn');
    const cancelEditBtn = getElem('cancelEditBtn');
    const loader = getElem('loader');
    const formTitle = getElem('form-title');
    const toastContainer = getElem('toastContainer');

    // --- 3. State Variables ---
    let editingRecipeId = null;
    let recipeIdToDelete = null;
    let allRecipesCache = []; // Cache to store recipes to reduce database reads

    // --- 4. Utility & Form Functions ---

    /**
     * Shows a toast notification.
     * @param {string} message The message to display.
     * @param {string} type 'success' or 'error'.
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    /**
     * Clears an error message for a form field.
     * @param {HTMLElement} inputEl The input element.
     */
    function clearError(inputEl) {
        inputEl.classList.remove('invalid');
        const errorEl = getElem(`${inputEl.id}Error`);
        if (errorEl) errorEl.textContent = '';
    }
    
    /**
     * Displays an error message for a form field.
     * @param {HTMLElement} inputEl The input element.
     * @param {string} message The error message.
     */
    function showError(inputEl, message) {
        inputEl.classList.add('invalid');
        const errorEl = getElem(`${inputEl.id}Error`);
        if (errorEl) errorEl.textContent = message;
    }

    /**
     * Validates the recipe form fields.
     * @returns {boolean} True if the form is valid.
     */
    function validateForm() {
        [recipeNameInput, recipeIngredientsInput, recipeStepsInput].forEach(clearError);
        let isValid = true;
        if (!recipeNameInput.value.trim()) {
            showError(recipeNameInput, 'Recipe name is required.');
            isValid = false;
        }
        if (!recipeIngredientsInput.value.trim()) {
            showError(recipeIngredientsInput, 'Ingredients are required.');
            isValid = false;
        }
        if (!recipeStepsInput.value.trim()) {
            showError(recipeStepsInput, 'Preparation steps are required.');
            isValid = false;
        }
        return isValid;
    }

    /**
     * Resets the form to its initial state.
     */
    function resetForm() {
        addRecipeForm.reset();
        imagePreview.innerHTML = '<span>+ Add Image</span>';
        editingRecipeId = null;
        saveRecipeBtn.textContent = 'Add Recipe';
        saveRecipeBtn.disabled = false;
        formTitle.textContent = 'Add New Recipe';
        cancelEditBtn.style.display = 'none';
        [recipeNameInput, recipeIngredientsInput, recipeStepsInput].forEach(clearError);
    }

    // --- 5. Core Recipe & Firebase Logic ---

    /**
     * Handles uploading an image file to Firebase Storage.
     * @param {File} file The image file from the input.
     * @returns {Promise<string|null>} The downloadable URL of the uploaded image.
     */
    async function uploadImage(file) {
        if (!file) return null;
        const filePath = `recipe-images/${Date.now()}_${file.name}`;
        const fileRef = storage.ref(filePath);
        await fileRef.put(file);
        return await fileRef.getDownloadURL();
    }

    /**
     * Handles form submission to save or update a recipe in Firestore.
     */
    async function handleSaveRecipe(e) {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please fix the errors before submitting.", 'error');
            return;
        }

        saveRecipeBtn.disabled = true;
        saveRecipeBtn.textContent = 'Saving...';

        try {
            let imageUrl = imagePreview.querySelector('img')?.src || '';
            const newImageFile = recipeImageInput.files[0];

            if (newImageFile && !imageUrl.startsWith('http')) {
                imageUrl = await uploadImage(newImageFile);
            }

            const recipeData = {
                name: recipeNameInput.value.trim(),
                ingredients: recipeIngredientsInput.value.trim().split('\n').filter(Boolean),
                steps: recipeStepsInput.value.trim().split('\n').filter(Boolean),
                image: imageUrl,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (editingRecipeId) {
                await db.collection('recipes').doc(editingRecipeId).update(recipeData);
                showToast('Recipe updated successfully!');
            } else {
                await db.collection('recipes').add(recipeData);
                showToast('Recipe added successfully!');
            }
            
            resetForm();
            await fetchAndRenderRecipes();

        } catch (error) {
            console.error("Error saving recipe: ", error);
            showToast("Failed to save recipe.", 'error');
            saveRecipeBtn.disabled = false;
            saveRecipeBtn.textContent = editingRecipeId ? 'Update Recipe' : 'Add Recipe';
        }
    }

    /**
     * Handles recipe deletion from Firestore after confirmation.
     */
    async function confirmDeletion() {
        if (!recipeIdToDelete) return;
        try {
            await db.collection('recipes').doc(recipeIdToDelete).delete();
            showToast('Recipe deleted successfully.', 'success');
            await fetchAndRenderRecipes();
        } catch (error) {
            console.error("Error deleting recipe: ", error);
            showToast("Failed to delete recipe.", 'error');
        } finally {
            confirmationModal.style.display = 'none';
            recipeIdToDelete = null;
        }
    }

    // --- 6. Rendering & UI Display ---

    /**
     * Fetches all recipes from Firestore, caches them, and triggers rendering.
     */
    async function fetchAndRenderRecipes() {
        loader.classList.add('show');
        recipesContainer.innerHTML = '';
        try {
            const snapshot = await db.collection('recipes').orderBy('createdAt', 'desc').get();
            allRecipesCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderRecipes(allRecipesCache);
        } catch (error) {
            console.error("Error fetching recipes: ", error);
            showToast("Could not load recipes from the cloud.", "error");
        } finally {
            loader.classList.remove('show');
        }
    }

    /**
     * Renders a given array of recipes to the UI, applying any search filters.
     * @param {Array} recipes The array of recipe objects to display.
     */
    function renderRecipes(recipes) {
        recipesContainer.innerHTML = '';
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        const filteredRecipes = searchTerm
            ? recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(searchTerm) || 
                (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)))
              )
            : recipes;

        if (filteredRecipes.length === 0) {
            recipesContainer.innerHTML = `<p class="no-recipes-message">No recipes found. Why not add one?</p>`;
        } else {
            filteredRecipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card';
                recipeCard.dataset.id = recipe.id;
                
                const imageEl = recipe.image 
                    ? `<img src="${recipe.image}" alt="${recipe.name}">` 
                    : '<div class="no-image">No Image</div>';
                
                const ingredientsText = recipe.ingredients ? `${recipe.ingredients.length} ingredients` : 'No ingredients';

                recipeCard.innerHTML = imageEl + `
                    <div class="recipe-card-content">
                        <h3>${recipe.name}</h3>
                        <p>${ingredientsText}</p>
                    </div>
                    <div class="recipe-card-actions">
                        <button class="action-btn edit" title="Edit Recipe" aria-label="Edit Recipe"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" title="Delete Recipe" aria-label="Delete Recipe"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                recipesContainer.appendChild(recipeCard);
            });
        }
    }
    
    /**
     * Fills the form with data for editing a recipe.
     * @param {string} recipeId The ID of the recipe to edit.
     */
    function populateFormForEdit(recipeId) {
        const recipe = allRecipesCache.find(r => r.id === recipeId);
        if (!recipe) return;

        recipeNameInput.value = recipe.name;
        recipeIngredientsInput.value = recipe.ingredients ? recipe.ingredients.join('\n') : '';
        recipeStepsInput.value = recipe.steps ? recipe.steps.join('\n') : '';
        imagePreview.innerHTML = recipe.image ? `<img src="${recipe.image}" alt="Preview">` : '<span>+ Add Image</span>';
        
        editingRecipeId = recipeId;
        saveRecipeBtn.textContent = 'Update Recipe';
        formTitle.textContent = 'Edit Recipe';
        cancelEditBtn.style.display = 'inline-block';

        addRecipeForm.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Displays a recipe's details in the main modal.
     * @param {string} recipeId The ID of the recipe to view.
     */
    function viewRecipeDetails(recipeId) {
        const recipe = allRecipesCache.find(r => r.id === recipeId);
        if (!recipe) return;

        const ingredientsList = recipe.ingredients ? recipe.ingredients.map(ing => `<li>${ing}</li>`).join('') : '<li>No ingredients listed.</li>';
        const stepsList = recipe.steps ? recipe.steps.map(step => `<li>${step}</li>`).join('') : '<li>No steps listed.</li>';

        modalContent.innerHTML = `
            ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="modal-recipe-image">` : ''}
            <h2>${recipe.name}</h2>
            <div class="modal-section">
                <h3>Ingredients</h3>
                <ul>${ingredientsList}</ul>
            </div>
            <div class="modal-section">
                <h3>Preparation Steps</h3>
                <ol>${stepsList}</ol>
            </div>
        `;
        recipeModal.style.display = 'block';
    }
    
    // --- 7. Event Handlers ---
    
    function handleRecipesContainerClick(e) {
        const target = e.target;
        const card = target.closest('.recipe-card');
        if (!card) return;
        
        const recipeId = card.dataset.id;
        
        if (target.closest('.edit')) {
            populateFormForEdit(recipeId);
        } else if (target.closest('.delete')) {
            recipeIdToDelete = recipeId;
            confirmationModal.style.display = 'block';
        } else {
            viewRecipeDetails(recipeId);
        }
    }

    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = e => imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        reader.onerror = () => showToast('Failed to read image.', 'error');
        reader.readAsDataURL(file);
    }
    
    function handleClearSearch() {
        searchInput.value = '';
        renderRecipes(allRecipesCache); // Render from cache, no re-fetch needed
    }
    
    function handleModalClose() {
        recipeModal.style.display = 'none';
        confirmationModal.style.display = 'none';
    }

    function handleKeyboard(e) {
        if (e.key === 'Escape') {
            handleModalClose();
        }
    }

    // --- 8. Event Listeners ---
    addRecipeForm.addEventListener('submit', handleSaveRecipe);
    searchInput.addEventListener('input', () => renderRecipes(allRecipesCache));
    clearSearchBtn.addEventListener('click', handleClearSearch);
    recipesContainer.addEventListener('click', handleRecipesContainerClick);
    recipeImageInput.addEventListener('change', handleImagePreview);
    
    // Modal close listeners
    recipeModal.querySelector('.close').addEventListener('click', handleModalClose);
    confirmationModal.querySelector('.close-confirm').addEventListener('click', handleModalClose);
    cancelDeleteBtn.addEventListener('click', handleModalClose);
    window.addEventListener('click', e => {
        if (e.target === recipeModal || e.target === confirmationModal) {
            handleModalClose();
        }
    });
    
    confirmDeleteBtn.addEventListener('click', confirmDeletion);
    cancelEditBtn.addEventListener('click', resetForm);

    // Global listeners
    window.addEventListener('keydown', handleKeyboard);

    // --- 9. Initial Load ---
    fetchAndRenderRecipes();
});