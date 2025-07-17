# Recipe Book Web Application

A responsive web-based Recipe Book that allows users to store, view, and search recipes locally in their browser.

## Features

- Add recipes with:
  - Name
  - Ingredients list
  - Preparation steps
  - Image upload
- View all recipes in card format
- Click recipes to see full details in a modal
- Search recipes by name or ingredients
- All data persists in browser localStorage
- Fully responsive design (mobile, tablet, desktop)

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript
- Browser localStorage for data persistence
- FileReader API for image handling

## How to Run

1. Clone this repository or download the files
2. Open `index.html` in any modern web browser
3. No server or additional dependencies required

## File Structure
recipe-book/
├── index.html # Main HTML file
├── style.css # Stylesheet
└── script.js # Main JavaScript logic

## Usage Instructions

### Adding a Recipe
1. Fill in the recipe name
2. Enter ingredients (one per line)
3. Enter preparation steps (one per line)
4. Optionally upload an image
5. Click "Add Recipe"

### Viewing Recipes
- All recipes appear as cards below the form
- Click any recipe card to view full details

### Searching Recipes
1. Type search terms in the search box
2. Click "Search" to filter recipes
3. Click "Clear" to reset the search

## Data Storage

All recipe data is stored in the browser's `localStorage` using JSON format. This means:

- Recipes persist between browser sessions
- Data is specific to each browser/device
- No server-side storage (completely client-side)

Images are converted to Base64 strings for storage.

## Browser Support

The application should work in all modern browsers including:

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Limitations

- Storage is limited by browser's localStorage quota (~5MB typically)
- Data is not shared across devices/browsers
- No user accounts or sharing functionality

## Future Enhancements

- Recipe categories/tags
- Export/import recipes
- Print recipe functionality
- Dark mode support

## License

This project is open source and available under the [MIT License](LICENSE).
