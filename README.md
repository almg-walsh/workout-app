# React Vite GitHub Pages App

This project is a React application built using Vite, configured for deployment on GitHub Pages. Below are the details for setting up, using, and deploying the application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/react-vite-github-pages-app.git
   ```
2. Navigate into the project directory:
   ```
   cd react-vite-github-pages-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm run dev
```
This will start the application in development mode. Open your browser and navigate to `http://localhost:3000` to view the app.

## Deployment

To deploy the application to GitHub Pages, follow these steps:

1. Build the application:
   ```
   npm run build
   ```
2. Push the changes to the `gh-pages` branch using the provided GitHub Actions workflow defined in `deploy.yml`.

Make sure to configure the `homepage` field in `package.json` to match your GitHub repository URL:
```json
"homepage": "https://yourusername.github.io/react-vite-github-pages-app"
```

For more detailed instructions on GitHub Pages deployment, refer to the [GitHub Pages documentation](https://pages.github.com/).