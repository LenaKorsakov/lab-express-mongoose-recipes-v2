const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model');

const app = express();

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
const MONGODB_URI = 'mongodb://127.0.0.1:27017/express-mongoose-recipes-dev';

mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error('Error connecting to mongo', err));

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
  res.send('<h1>LAB | Express Mongoose Recipes</h1>');
});

//  Iteration 3 - Create a Recipe route
app.post('/recipes', async (req, res, next) => {
  const newRecipe = { ...req.body };
  Recipe.create(newRecipe)
    .then((recipe) => {
      res.status(201).json(recipe);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

//  Iteration 4 - Get All Recipes
app.get('/recipes', async (req, res) => {
  await Recipe.find()
    .then((allRecipes) => res.status(200).json(allRecipes))
    .catch((error) => res.status(500).json({ message: error.message }));
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const oneRecipe = await Recipe.findById(id);
    res.status(200).json(oneRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('recipes/:id', async (req, res) => {
  const { id } = req.params;

  await Recipe.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedRecipe) => {
      res.status(200).json(updatedRecipe);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('recipes/:id', async (req, res) => {
  const { id } = req.params;

  await Recipe.findByIdAndDelete(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// BONUS
//  Bonus: Iteration 9 - Create a Single User
//  POST  /users route

//  Bonus: Iteration 10 | Get a Single User
//  GET /users/:id route

//  Bonus: Iteration 11 | Update a Single User
//  GET /users/:id route

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
