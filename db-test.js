const database = require("./models");

database.recipe.findOrCreate({
  where: {
    name: "Cake"
  }
}).then(function([recipe, created]) {
  // Second, get a reference to a toy.
  database.category.findOrCreate({
    where: {name: "Pasta"}
  })
  .then(function([category, created]) {
    // Finally, use the "addModel" method to attach one model to another model.
    console.log(category);
    recipe.addCategory(category)
    .then(function(relationInfo) {
      console.log(category.name, "added to", recipe.name);
    });
  })
  .then(([recipe, created]) => {
    database.area.findOrCreate({
      where: {name: "Italian"}
    }).then( ([area, created]) => {
      recipe.addArea(area).then((relationInfo) => {
        console.log(area.name, "added to", recipe.name);
      })
    })
  })
});