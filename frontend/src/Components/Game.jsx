import { useState, useEffect } from "react";
import { Input, Button, notification, Modal } from "antd";
import axios from "axios";

function Game() {
  const [word, setWord] = useState("hello");
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes

  useEffect(() => {
    // Update the background color based on time left
    if (timeLeft > 80) {
      document.body.style.backgroundColor = "green"; // the player is bing chilling
    } else if (timeLeft > 40) {
      document.body.style.backgroundColor = "yellow"; // cutting it a lil close
    } else {
      document.body.style.backgroundColor = "red"; // rip bruh
    }

    // revert the body background color when the component is unmounted
    return () => {
      document.body.style.backgroundColor = ""; // Resets to default
    };
  }, [timeLeft]); // This effect runs whenever the time left changes

  useEffect(() => {
    fetchNewWord(); // fetch like that old gameshow with the orange dog
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          notification.info({
            message: "Time's up!",
            description: `Your score is: ${score}`,
            placement: "bottomRight",
            duration: 4, // if a player gets this notif that means its a skill issue
          });
          return 0;
        }
        return prevTime - 1; // count down the timer
      });
    }, 1000);

    // Reset the timer for a new word
    return () => clearInterval(timer);
  }, []);

  const fetchNewWord = () => {
    // defining the function to yoink a new word from the backend
    setTimeLeft(120);
    var config = {
      method: "get",
      url: "http://localhost:3000/play",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setWord(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    // stops the player from entering a new word when the timer has all ready ran out
    if (timeLeft <= 0) {
      notification.warning({
        message: "Time's up!",
        description: "Please refresh the page to play again.",
        placement: "bottomRight",
        duration: 4,
      });
      return;
    }
    var config = {
      method: "patch",
      url: `http://localhost:3000/guessWord?value=${guess}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        if (response.data === true) {
          setScore(score + 1);
          setShowModal(true); // Show the pop-up when guessed correctly
        } else {
          notification.error({
            // wrong error notif
            message: "Wrong!",
            description: "Guess again!",
            placement: "bottomRight",
            duration: 2,
          });
        }
        setGuess(""); // clear the guess
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleContinue = () => {
    // dismiss the notif to continue the game
    setShowModal(false);
    fetchNewWord();
  };

  const handleSeeScore = () => {
    // showing the user their score if they so choose
    setShowModal(false);
    notification.info({
      message: "Score",
      description: `Your score is: ${score}`,
      placement: "bottomRight",
      duration: 4,
    });
  };

  return (
    // random shit for slay aesthethics
    <div className="card">
      <h2> Current Word: {word} </h2>
      <Input
        size="large"
        placeholder="Enter your guess"
        onChange={(input) => {
          setGuess(input.target.value);
        }}
        value={guess}
      />
      <br /> <br />
      <div
        style={{
          // clears the progress bar that counts down lfg
          background: "#ddd",
          height: "20px",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#2196F3",
            height: "20px",
            width: `${(timeLeft / 120) * 100}%`,
          }}
        ></div>
      </div>
      <Button type="primary" size="large" onClick={handleSubmit}>
        Submit
      </Button>
      <p> Score: {score} </p>
      <p> Time Left: {timeLeft} seconds </p>
      <Modal // describes what the popup looks like when the user guesses a word correctly
        title="Congratulations!"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="continue" type="primary" onClick={handleContinue}>
            Continue!
          </Button>,
          <Button key="score:" onClick={handleSeeScore}>
            See my Score
          </Button>,
        ]}
      >
        Would you like to continue playing or see your score?
      </Modal>
    </div>
  );
}
export default Game;
