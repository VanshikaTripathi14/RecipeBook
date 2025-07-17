# 🍳 Recipe Book Web Application

A responsive web-based Recipe Book that allows users to store, view, and search recipes locally in their browser. This project is built with vanilla HTML, CSS, and JavaScript, focusing on core web technologies and local browser storage.

---

## ✨ Features

-   *Add Recipes*: Easily add new recipes with a name, ingredients list, preparation steps, and an image.
-   *View All Recipes*: Browse all your saved recipes in a clean, card-based layout.
-   *Detailed View*: Click on any recipe card to see its full details in a pop-up modal.
-   *Powerful Search*: Instantly search for recipes by their name or ingredients.
-   *Local Persistence*: All your recipe data is saved directly in the browser's localStorage.
-   *Image Handling*: Upload images for your recipes, which are converted to Base64 and stored locally.
-   *Fully Responsive*: The design seamlessly adapts to mobile, tablet, and desktop screens.

---

## 🛠 Technologies Used

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

-   *HTML5*: For the core structure and content.
-   *CSS3*: For styling, including Flexbox and Grid for responsive layouts.
-   *Vanilla JavaScript*: For all the application logic and interactivity.
-   *Browser localStorage*: For client-side data persistence.
-   *FileReader API*: For handling and processing image uploads.

---

## 🚀 How to Run

No server or special dependencies are needed! Just follow these simple steps:

1.  Clone this repository or download the project files.
    bash
    git clone [https://github.com/your-username/recipe-book.git](https://github.com/your-username/recipe-book.git)
    
2.  Navigate to the project directory.
    bash
    cd recipe-book
    
3.  Open the index.html file in any modern web browser.

---

## 📂 File Structure

The project is organized with a simple and clean file structure:

'''
recipe-book/
├── index.html  # Main HTML file for the application structure
├── style.css   # All styles for the application
└── script.js   # Core JavaScript logic and functionality
'''


---

## 📖 Usage Instructions

### Adding a Recipe
1.  Fill in the *recipe name*.
2.  Enter *ingredients*, with each one on a new line.
3.  Enter the *preparation steps*, with each step on a new line.
4.  Optionally, click "Choose File" to *upload an image* for the recipe.
5.  Click the *"Add Recipe"* button to save it.

### Viewing Recipes
-   All saved recipes are displayed as cards in the main view.
-   Click on any recipe card to open a modal and view its full details, including the image, ingredients, and preparation steps.

### Searching Recipes
1.  Type your search query (name or ingredient) into the search box at the top.
2.  Click the *"Search"* button to filter the displayed recipes.
3.  Click the *"Clear"* button to remove the filter and show all recipes again.

---

## 💾 Data Storage

All recipe data, including images, is stored in the browser's localStorage as a JSON string.

-   ✅ *Persistent Data*: Your recipes will be available even after you close and reopen the browser.
-   🔒 *Private*: Data is stored locally on your device and is not sent to any server.
-   🖼 *Image Storage: Images are converted to **Base64* strings to be stored alongside other recipe data in localStorage.

---

## ✅ Browser Support

The application is designed to work flawlessly on all modern web browsers:

-   Google Chrome (latest)
-   Mozilla Firefox (latest)
-   Microsoft Edge (latest)
-   Apple Safari (latest)

---

## ⚠ Limitations

-   *Storage Capacity*: Data is limited by the browser's localStorage quota, which is typically around 5MB.
-   *Device Specific*: Recipes are not synchronized across different browsers or devices.
-   *No User Accounts*: The application is fully client-side and does not support user accounts or online sharing.

---

## 🔮 Future Enhancements

Here are some potential features for future versions:

-   [ ] Recipe categories and tags for better organization.
-   [ ] Export/Import recipes as a JSON or text file.
-   [ ] A "Print Recipe" functionality.
-   [ ] Dark mode support for the UI.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
