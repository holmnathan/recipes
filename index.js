"use strict";

//-----------------------------------------------------------------------------
// node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config();

const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const axios = require("axios");
const app = express();

//-----------------------------------------------------------------------------
// Middleware
//-----------------------------------------------------------------------------

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("/public"));
app.use(ejsLayouts);

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

app.get("/", (req, res) => {
  const pageTitle = "Recipes App";
  res.render("main/index.ejs", {pageTitle});
});

app.use("/recipes", require("./controllers/recipes.js"));

app.get("*", (req, res) => {
  const pageTitle = "Page Not Found"
  res.render("main/error-404.ejs", {pageTitle});
})

//-----------------------------------------------------------------------------
// Port Listener
//-----------------------------------------------------------------------------

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Recipes | Listening on port ${process.env.PORT || 3000}`);
});

module.exports = server;