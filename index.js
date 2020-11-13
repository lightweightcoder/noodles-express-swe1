import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();

// set the library (template engine || view engine) to use for all requests
app.set('view engine', 'ejs');

app.use(express.static('public'));

const PORT = 3004;

// route callback functions ================================================
// request callback function to render the main page data to ejs
const whenRequestForMainPage = (request, response) => {
  console.log('request came in');

  // read the JSON file and convert contents to a JS object and pass to callback
  read('data.json', (dataJsObject, error) => {
    // return reading error if there is
    if (error) {
      console.log('error reading file');
      response.send(`Error reading file: ${error}`);
    }

    // if no reading error ----------------------
    // get the navbar object from data.json JS object
    const { navbar } = dataJsObject;

    // get the mainpage object from the data.json JS object
    const { mainPage } = dataJsObject;

    // set the ejs data
    const ejsData = {
      navbar,
      mainPage,
    };

    // render the main page object to ejs
    response.render('main-page', ejsData);
  });
};

// request callback function to render data of the category of ingredient requested to ejs
const whenRequestForCategory = (request, respond) => {
  console.log('request came in');

  // read the JSON file and convert contents to a JS object and pass to callback
  read('data.json', (dataJsObject, error) => {
    // return reading error if there is
    if (error) {
      console.log('error reading file');
      response.send(`Error reading file: ${error}`);
      return;
    }

    // if no reading error ------------------------------------
    // get the ingredient category requested
    const { ingredient } = request.params;
  });
};

// request callback function to read the recipe index requested and
// respond with the corresponding recipe data as a raw JSON object
const whenRequestForRecipe = (request, response) => {
  console.log('request came in');

  // read the JSON file and convert contents to a JS object and pass to callback
  read('data.json', (dataJsObject, error) => {
    // return reading error if there is
    if (error) {
      console.log('error reading file');
      response.send(`Error reading file: ${error}`);
      return;
    }

    // if no reading error ------------------------------------
    // get the index requested
    const { index } = request.params;

    // return error 404 if the index parameter is requesting for something that does not exist
    // (i.e. value of index is NaN or not within recipes.length)
    if (isNaN(index) || index > dataJsObject.recipes.length || index < 0) {
      response.status(404).send('Sorry, we cannot find that!');
    }

    // get the recipe object corresponding to the index
    const recipeObject = dataJsObject.recipes[index];

    // create the display of the recipe object
    let htmlResponseContent = '{ <br>';
    const recipeObjectKeysArray = Object.keys(recipeObject);
    recipeObjectKeysArray.forEach((key) => {
      htmlResponseContent += `"${key}": "${recipeObject[key]}"; <br>`;
    });
    htmlResponseContent += '}';

    // send the object as the response
    response.send(htmlResponseContent);
  });
};

// set the route for main page
app.get('/', whenRequestForMainPage);

// set the route for ingredient category lists
app.get('/category/:ingredient', whenRequestForCategory);

// set the route for recipe
app.get('/recipe/:index', whenRequestForRecipe);

// initialise the request listener port functionality
app.listen(PORT);
