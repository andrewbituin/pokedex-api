require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const POKEDEX = require("./pokedex.json");

app.use(helmet());
app.use(cors());

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganOption));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log("Validate bearer token middleware.");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(400).json({ error: "Unauthorized request" });
  }
  next();
});

function handleGetTypes(req, res) {
  const validTypes = [
    `Bug`,
    `Dark`,
    `Dragon`,
    `Electric`,
    `Fairy`,
    `Fighting`,
    `Fire`,
    `Flying`,
    `Ghost`,
    `Grass`,
    `Ground`,
    `Ice`,
    `Normal`,
    `Poison`,
    `Psychich`,
    `Rock`,
    `Steel`,
    `Water`
  ];
  res.json(validTypes);
}
app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  const { name, type } = req.query;
  let userPokemon = POKEDEX.pokemon;
  if (name) {
    userPokemon = POKEDEX.pokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (type) {
    userPokemon = POKEDEX.pokemon.filter(pokemon =>
      pokemon.type.map(type => type.toLowerCase()).includes(type.toLowerCase())
    );
  }
  res.json(userPokemon);
}

app.get("/pokemon", handleGetPokemon);

app.use((error, req, res, next) => {
  let response
  if(process.env.NODE_ENV === 'production'){
    response = { error: {message: 'server error'}}
  }
  else{
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
