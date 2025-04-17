# CRUD Application with Python-Flask and React as frontend

### Deliverables

- [ ] Full project in Zip Folder, it should contain:
    - [ ] It should have screenshots showing functional version
    - [ ] It should run without any issue, if I run: ```python app.py```
- [ ] Screenshot of the running project on Codesandbox, Codespaces or render

## Part 1

1. Login to GitHub Account
2. Clone the repository (You can fork or upload too)
    - If you go with codespaces option: In the repository, create a new Codespaces Environment.
    - If you go with local execution, open the project in your code editor.
4. Run the application

## Part 2

1. Use npm run build to make the dist folder: ```npm run build```
2. Check the python code, <mark> make modification to the directories such that flask can find the dist folder of react </mark>.
    - The `template_folder` is the one which the `index.html` file is rendered from
    - The `static_folder` is the host for the static files, which `index.html` will need to render.
```python 
        app = Flask(__name__, 
                    template_folder='./',
                    static_folder='./')
```

3. Run the database initiator from the browser:
in the browser open `http://127.0.0.1:5000/init` to initiate the database.

4. Examine if the web app is functioning normally.

5. Download the repo, and upload it in myCourses.

## Structure of the application

1. backend (app.py)
2. database (mydatabase.db)
3. frontend (_frontend/users)

## Backend - You need a terminal to run the application

The back end of the application is based on Flask library. The steps to run the application are as follows:

1. Initiate the virtual environment:
```python3 -m venv env```
2. Activate the env:
in Windows run ```env\source\activate.bat```
in  Mac OS: ```source env/bin/activate```
3. install the needed libraries:
```pip install -r requirements.txt```
4. run the application:
```python app.py``` (note that python should be installed on your machine, or you can run it on a virtual environment/GitHub Codespaces)

## Database

The database is based on SQLite. If the database does not exist, it will be created automatically.
You just need to visit this endpoint to create the database:
```http://127.0.0.1:5000/init```

## Frontend -You need a new terminal to run the application

The frontend is based on React library. The steps to run the application are as follows:
 
 1. Open the frontend app by using `cd _frontend/users/`
 2. Instal dependencies for react.js `npm i`
 3. to build the static version of react application `npm run build`

 ## Important Configuration

The configurations in `vite.config.js` are crucial for the settings needed in the production. Check the current settings, and if needed modify them:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':"http://127.0.0.1:5000"
    }
  },
  plugins: [react()],
})
```
