const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
let randomWords;

import("random-words").then((module) => {
  randomWords = module;
  const PORT = 3000; // May need to change PORT to something else if 3000 is already in use
  app.use(cors()); //Middleware used to send data to frontend

  let score = 0; // Initializing the score variable
  let word = newWord(); // generating a word to be guessed to start off
  let guess_count = 0; //Initializing a variable to count how many guesses the user has submitted

  function newWord() {
    // defining the function that is called to generate a new random word
    randoWord = randomWords.generate();
    return randoWord;
  }

  function scrambleString(str) {
    let array = str.split(""); // Convert string to an array of characters

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.round(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swapping elements around in the string to randomize it
    }

    return array.join(""); // Convert array of characters back to a string
  }

  app.get("/play", (req, res) => {
    // Make sure that after each guess the user is prompted to either play again (and thus go here) or end the game and go to /score
    word = newWord();
    let scram_word = scrambleString(word);
    while (scram_word === word) {
      //Making sure when the word is shuffled it doesn't accidently return in order.
      scram_word = scrambleString(word);
    }
    res.send(`${scram_word}`);
  });

  app.get("/play/score", (req, res) => {
    res.status(200).send(`Thanks for playing, your score was:${score}`);
  });

  app.patch("/guessWord", (req, res) => {
    let guessedWord = req.query.value;
    if (guessedWord === word) {
      guess_count += 1; //add to guess_count
      score += 1; //add to score
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
      guess_count += 1; // add to guess count
    }
  });

  app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
  });
});
// swag money gaming
