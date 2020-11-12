import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();

const PORT = 3004;

// function to read the index requested and
// respond with the corresponding recipe data as a raw JSON object
const whenIncomingRequestForRecipe = (request, response) => {
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

// set the route
app.get('/recipe/:index', whenIncomingRequestForRecipe);

// initialise the request listener port functionality
app.listen(PORT);
