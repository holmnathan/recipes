"use strict";

//-----------------------------------------------------------------------------
// node.js Dependencies
//-----------------------------------------------------------------------------

const express = require("express");
const axios = require("axios");
const router = express.Router();

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

router.get("/search", (req, res) => {
  const THEMEALDB_API_KEY = process.env.THEMEALDB_API_KEY;
  const apiUrl = `https://www.themealdb.com/api/json/v1/${THEMEALDB_API_KEY}/search.php`;
  const query = {
    params: {
      s: req.query.q
    }
  };
  
  let recipe;
  let pageTitle;
  
  axios.get(apiUrl, query)
  .then((apiResponse) => {
    pageTitle = req.query.q;
    recipe = apiResponse.data.meals;
    
    if (recipe !== null) {
      res.render("recipes/recipe-search.ejs", {pageTitle, recipe} );
    } else {
      res.render("recipes/no-result.ejs", {pageTitle});
    }
  });
});

router.get("/:idMeal", (req, res) => {
  const THEMEALDB_API_KEY = process.env.THEMEALDB_API_KEY;
  const apiUrl = `https://www.themealdb.com/api/json/v1/${THEMEALDB_API_KEY}/lookup.php`;
  const query = {
    params: {
      i: req.params.idMeal
    }
  };
  // Remove unwanted strings from instructions array.
  const handleInstructions = (arrayValue) => {
    return arrayValue !== "" && arrayValue.length > 10;
  };
  
  // 
  const handleIngredients = (recipeArray) => {
    let outputArray = []
    for (let i = 1; i <= 20; i += 1) {
      let ingredient = {
        name: recipeArray[`strIngredient${i}`],
        quantity: recipeArray[`strMeasure${i}`]
      }
      outputArray.push(ingredient);
    }
    return outputArray;
  }
  
  let recipe;
  let pageTitle;
  let instructions;
  let ingredients
  
  axios.get(apiUrl, query)
  .then((apiResponse) => {
    recipe = apiResponse.data.meals ? apiResponse.data.meals[0] : null;
    
    if (recipe !== null) {
      pageTitle = recipe.strMeal;
      
      // Remove newline characters from recipe instructions
      // Convert recipe instructions to an array.
      // Remove unwanted values from instructions array.
      instructions = recipe.strInstructions.split("\r\n");
      instructions = instructions.filter(handleInstructions);
      
      // Convert ingredients to an array
      ingredients = handleIngredients(recipe);
      
      // console.log(recipe);
      // console.log("Ingredients: ", ingredients);
      // console.log("Instructions:", instructions);
      
      res.render("recipes/recipe.ejs", {pageTitle, recipe, instructions, ingredients});
    } else {
      pageTitle = "Recipe";
      res.render("recipes/no-result.ejs", {pageTitle});
    }
  });
});

module.exports = router;