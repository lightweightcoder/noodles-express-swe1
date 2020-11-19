import express from 'express';
import cookieParser from 'cookie-parser';
import { read } from './jsonFileStorage.js';

const app = express();

// set the library (template engine || view engine) to use for all requests
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(cookieParser());

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

// request callback function to render category.ejs with data from data.json
const whenRequestForCategory = (request, response) => {
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

    // add a global index to each recipe
    dataJsObject.recipes.forEach((element, index) => {
      element.index = index;
    });

    // get the recipes of the ingredient category requested
    const recipes = dataJsObject.recipes.filter((element) => element.category === ingredient);

    // get the navbar object from data.json JS object
    const { navbar } = dataJsObject;

    // set the data to be sent to category.ejs
    const ejsData = {
      navbar,
      ingredient,
      recipes,
    };

    // render the main page object to ejs
    response.render('category', ejsData);
  });
};

// request callback function to render recipe.ejs with data from data.json
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
      return;
    }

    // get the recipe object corresponding to the index
    const recipeObject = dataJsObject.recipes[index];

    // get the navbar object from data.json JS object
    const { navbar } = dataJsObject;

    // set the ejs data
    const ejsData = {
      navbar,
      recipeObject,
    };

    // create a cookie
    response.cookie('name', 'tobi');
    response.cookie('weight', '230');

    // delete a cookie
    // response.clearCookie('name');

    // see that the cookies are combined and returned as a string.
    console.log(request.headers.cookie);

    // render the main page object to ejs
    response.render('recipe', ejsData);
  });
};

// set routes ========================================
// set the route for main page
app.get('/', whenRequestForMainPage);

// set the route for ingredient category lists
app.get('/category/:ingredient', whenRequestForCategory);

// set the route for recipe
app.get('/recipe/:index', whenRequestForRecipe);

// set the route for 3.6.1-cookies exercise
app.get('/home', (request, response) => {
  let visits;

  if (request.cookies.visits === undefined) {
    response.cookie('visits', 1);
    visits = 1;
  } else {
    console.log(request.cookies.visits);
    visits = Number(request.cookies.visits); // get the value from the request
    console.log(visits);

    // set a new value of the cookie
    visits += 1;

    response.cookie('visits', visits); // set a new value to send back
  }

  response.send(`Current cookie value- visits:${visits}`);
});

// initialise the request listener port functionality
app.listen(PORT);
