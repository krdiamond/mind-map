# Vue 3 + Vite

npm run dev
- This is for development mode. It runs the app locally for you to work on during development. 
- Use it while you're coding—it has features like hot reloading, so changes are reflected immediately.

npm run serve
- This is for previewing the production build locally. Use it after build—you run this to make sure everything looks good before deploying.

npm run build
- This creates the production version of your app. 
- Minifies your JavaScript and CS
- Optimizes images and other assets
- Creates the final static files in the dist/ directory
- Use this before deploying—it's a necessary step to ensure your app is optimized for performance.

npm run gitDeploy
- This is the deployment script. It pushes the production-ready files (from dist/) to GitHub Pages.
- Use it after build—it will publish the contents of dist/ to GitHub Pages.