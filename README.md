# 🍳 Recipe Book Web Application

A simple, responsive, and purely client-side web application for storing, viewing, and searching your favorite recipes. All data is saved directly in your browser's local storage, making it fast and easy to use without any server setup.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

***

## ✨ Features

* *📝 Add & Manage Recipes:* Easily add recipes with a name, ingredient list, preparation steps, and an optional photo.
* *🖼 Card-Based UI:* View all your recipes at a glance in a clean, modern card layout.
* *🔍 Powerful Search:* Quickly find recipes by searching for names or specific ingredients.
* *💻 Local Persistence:* All your recipe data is stored in the browser's localStorage, so it's saved between sessions.
* *📱 Fully Responsive:* A seamless experience on desktops, tablets, and mobile devices.
* *🚀 Zero Dependencies:* Runs entirely in the browser with just HTML, CSS, and vanilla JavaScript.

---

## 🚀 Getting Started

No server or complex setup is required! Just follow these simple steps to run the application locally.

1.  *Clone the repository:*
    bash
    git clone [https://github.com/your-username/recipe-book.git](https://github.com/your-username/recipe-book.git)
    

2.  *Navigate to the directory:*
    bash
    cd recipe-book
    

3.  *Open the application:*
    Simply open the index.html file in any modern web browser like Chrome, Firefox, or Edge.

---

## 📖 How to Use

### Adding a New Recipe
1.  Fill in the *Recipe Name, **Ingredients* (one per line), and *Preparation Steps* (one per line) in the form.
2.  Optionally, click *"Choose File"* to upload an image for your recipe.
3.  Click the *"Add Recipe"* button to save it.

### Viewing & Searching
* All saved recipes are displayed as cards on the main page.
* Click on any recipe card to open a modal with its full details.
* Use the search bar at the top to filter recipes by name or ingredients. Click *"Search"* to apply the filter and *"Clear"* to see all recipes again.

---

## 🛠 Technologies Used

* *HTML5:* For the core structure and content.
* *CSS3:* For styling, including *Flexbox* and *Grid* for responsive layouts.
* *Vanilla JavaScript:* For all application logic, DOM manipulation, and event handling.
* **Browser localStorage API:** To persist recipe data on the client-side.
* **FileReader API:** To handle image uploads and convert them to Base64 for storage.

---

## 💾 Data Storage

This application is designed to be completely serverless. All recipe data, including images (converted to Base64 strings), is stored as a JSON object in the browser's localStorage.

*Key Points:*
* Data persists across browser sessions.
* Storage is private and specific to your browser and device.
* There is no server-side database or user account system.

---

## ⚠ Limitations

* *Storage Capacity:* Data is limited by the browser's localStorage quota, which is typically around 5MB.
* *Device Specific:* Recipes are not synchronized across different browsers or devices.
* *No Sharing:* The application does not include features for sharing recipes with other users.

---

## 💡 Future Enhancements

Here are some potential features for future versions:

- [ ] Recipe categories and tags for better organization.
- [ ] Functionality to export/import recipes as JSON or text files.
- [ ] A dedicated "Print Recipe" button.
- [ ] A dark mode theme for comfortable viewing in low light.
- [ ] Edit and Delete functionality for existing recipes.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). Feel free to fork, modify, and use it as you see fit.
