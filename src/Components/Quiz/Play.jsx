import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';

import M from 'materialize-css';
// import JSON file
import questions from '../../questions.json';
// import utils
import isEmpty from '../../utils/is-empty';
// import sound effects
import correctSound from '../../assets/audio/correct-answer.mp3';
import wrongSound from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';
// style import
import Particles from 'react-particles-js';

const ParticleParams = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
      size: {
        value: 3,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
    },
  },
};

export default class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: '',
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      numberOfUnansweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hints: 5,
      fiftyFifty: 2,
      usedFiftyFifty: false,
      nextButtonDisabled: false,
      previousButtonDisabled: true,
      previousRandomNumbers: [],
      time: {},
    };
    // timer set
    this.interval = null;

    // ref let us use DOM elements in react
    this.correctSound = React.createRef();
    this.wrongSound = React.createRef();
    this.buttonSound = React.createRef();

    // binding methods
    this.handleOnClick = this.handleOnClick.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.nextButtonClick = this.nextButtonClick.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.quitButtonClick = this.quitButtonClick.bind(this);
    this.displayQuestions = this.displayQuestions.bind(this);
    this.handleHints = this.handleHints.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.handleFiftyFifty = this.handleFiftyFifty.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleDisableButton = this.handleDisableButton.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  componentDidMount() {
    const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
    this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // display questions method
  displayQuestions = (
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion,
  ) => {
    let { currentQuestionIndex } = this.state;
    if (!isEmpty(this.state.questions)) {
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestion - 1];
      const answer = currentQuestion.answer;
      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          numberOfQuestions: questions.length,
          answer,
          previousRandomNumbers: [],
        },
        () => {
          this.showOptions(); // this will show options when ques is changed
          this.handleDisableButton(); // check to disable buttons each time our question is rendered
        },
      );
    }
  };

  // play button sound
  playButtonSound = () => {
    this.buttonSound.current.play();
  };

  // Handle Click function, check to see if user clicks on right opt
  handleOnClick = e => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      setTimeout(() => {
        this.correctSound.current.play();
      }, 500); // delaying time play method

      // if target inner html is equal to answer, then correct
      this.correctAnswer(); // call correct answer method
    } else {
      setTimeout(() => {
        this.wrongSound.current.play();
      }, 500); // delaying time for play method
      // if wrong
      this.wrongAnswer(); // call wrong answer method
    }
  };

  // button click function
  buttonClick = e => {
    switch (e.target.id) {
      case 'next-button':
        this.nextButtonClick();
        break;

      case 'previous-button':
        this.previousButtonClick();
        break;

      case 'quit-button':
        this.quitButtonClick();
        break;

      default:
        break;
    }
  };

  // next button click function
  nextButtonClick = () => {
    this.playButtonSound();
    if (this.state.nextQuestion !== undefined) {
      this.setState(
        prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          let { state, currentQuestion, nextQuestion, previousQuestion } = this.state;
          this.displayQuestions(state, currentQuestion, nextQuestion, previousQuestion);
        },
      );
    }
  };

  // previous button click function
  previousButtonClick = () => {
    this.playButtonSound();
    if (this.state.previousQuestion === undefined) {
      this.setState(
        prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          let { state, currentQuestion, nextQuestion, previousQuestion } = this.state;
          this.displayQuestions(state, currentQuestion, nextQuestion, previousQuestion);
        },
      );
    }
  };

  // quit button click function
  quitButtonClick = () => {
    this.playButtonSound();
    //window.confirm('Are you sure you want to quit?');
    if (window.confirm('Are you sure you want to quit?')) {
      this.props.history.push('/'); // takes us back to homepage
    }
  };

  // when there is a correct answer, this method will display a toast
  correctAnswer = () => {
    M.toast({
      html: 'Correct Answer!',
      classes: 'toast-valid',
      displayLength: 1500,
    }); //update state after display, cb function arg which will have access to  prev state
    this.setState(
      prevState => ({
        score: prevState.score + 1, // ans is correct to increment by 1 - new score will be prevState
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGame();
        } else {
          let { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
          this.displayQuestions(
            // passing the new state after the prevState have been updated
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion,
          );
        }
      },
    );
  };

  // wrong answer method
  wrongAnswer = () => {
    // this is to cause the device to vibrate eg. mobile device set to 1 second
    navigator.vibrate(1000);
    M.toast({
      html: 'Wrong Answer!',
      classes: 'toast-invalid',
      displayLength: 1500,
    }); //update state after display, cb function arg which will have access to  prev state
    this.setState(
      prevState => ({
        wrongAnswers: prevState.wrongAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGame();
        } else {
          let { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
          this.displayQuestions(
            // passing the new state after the prevState have been updated
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion,
          );
        }
      },
    );
  };

  // Show Options for hints
  showOptions = () => {
    const options = Array.from(document.querySelectorAll('.option'));

    options.forEach(option => {
      option.style.visibility = 'visible';
    });
    // setting fiftyFifty back to false so it can be reused
    this.setState({
      usedFiftyFifty: false,
    });
  };

  // handleHints function
  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll('.option')); // convert the node list to an array
      let indexOfAnswer; //get index of the answer from the 4 options

      options.forEach((option, index) => {
        // looping through options with for loop
        if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
          indexOfAnswer = index;
        }
      });
      // while look to generate random number
      while (true) {
        const randomNumber = Math.round(Math.random() * 3); // generate random number from 0 to 3
        if (
          randomNumber !== indexOfAnswer &&
          !this.state.previousRandomNumbers.includes(randomNumber)
        ) {
          //if random number don't match the index of our answer, execute code below
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = 'hidden'; // inline style
              this.setState(prevState => ({
                hints: prevState.hints - 1, //reduce hints from our state
                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber),
              }));
            }
          });
          break;
        }
        if (this.state.previousRandomNumbers.length >= 3) break; // prevent an infinite loop
      }
    }
  };

  // Handle Fifty Fifty
  handleFiftyFifty = () => {
    if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
      const options = document.querySelectorAll('.option');
      const randomNumbers = [];
      let indexOfAnswer;

      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
          indexOfAnswer = index;
        }
      });

      let count = 0;
      do {
        const randomNumber = Math.round(Math.random() * 3);
        if (randomNumber !== indexOfAnswer) {
          if (
            randomNumbers.length < 2 &&
            !randomNumbers.includes(randomNumber) &&
            !randomNumbers.includes(indexOfAnswer)
          )
            randomNumbers.push(randomNumber);
          count++; // above returns false, generate below code
        } else {
          while (true) {
            const newRandomNumber = Math.round(Math.random() * 3);
            if (
              !randomNumbers.includes(newRandomNumber) &&
              !randomNumbers.includes(indexOfAnswer)
            ) {
              randomNumbers.push(newRandomNumber);
              count++;
              break; // break so the code run infinite
            }
          }
        }
      } while (count < 2);
      // hiding the random numbers from user
      options.forEach((option, index) => {
        if (randomNumbers.includes(index)) {
          option.style.visibility = 'hidden';
        }
      });
      this.setState(prevState => ({
        fiftyFifty: prevState.fiftyFifty - 1,
        usedFiftyFifty: true,
      }));
    }
  };

  // timer function
  startTimer = () => {
    const countDownTimer = Date.now() + 180000;
    this.interval = setInterval(() => {
      const now = new Date();
      const distance = countDownTimer - now;

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.interval);
        this.setState(
          {
            time: {
              minutes: 0,
              seconds: 0,
            },
          },
          () => {
            this.endGame();
          },
        );
      } else {
        this.setState({
          time: {
            minutes,
            seconds,
            distance,
          },
        });
      }
    }, 1000);
  };

  // Disabled button function
  handleDisableButton = () => {
    if (this.state.previousQuestion === !undefined || this.state.currentQuestionIndex === 0) {
      // if true disable prev button
      this.setState({
        previousButtonDisabled: true,
      });
    } else {
      this.setState({
        previousButtonDisabled: false,
      });
    }

    if (
      this.state.nextQuestion === undefined ||
      this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions
    ) {
      //array(numberOfQuestions)is always 0 base + 1
      this.setState({
        nextButtonDisabled: true,
      });
    } else {
      this.setState({
        nextButtonDisabled: false,
      });
    }
  };

  // end game function
  endGame = () => {
    alert('Quiz has ended!!');
    const { state } = this;
    const playerStats = {
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      fiftyFiftyUsed: 2 - state.fiftyFifty,
      hintsUsed: 5 - state.hints,
    };

    setTimeout(() => {
      this.props.history.push('/play/quizSummary', playerStats);
    });
  };

  render() {
    const {
      currentQuestion,
      currentQuestionIndex,
      numberOfQuestions,
      hints,
      fiftyFifty,
      time,
    } = this.state;
    return (
      <>
        <Helmet>Quiz Page</Helmet>
        <>
          <audio src={correctSound} ref={this.correctSound}></audio>
          <audio src={wrongSound} ref={this.wrongSound}></audio>
          <audio src={buttonSound} ref={this.buttonSound}></audio>
        </>
        <div className="questions">
          <Particles className="particles" params={ParticleParams} />
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            <p>
              <span
                onClick={this.handleFiftyFifty}
                className="mdi mdi-set-center mdi-24px lifeline-icon"
              ></span>
              <span className="lifeline">{fiftyFifty}</span>
            </p>
            <p>
              <span
                onClick={this.handleHints}
                className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"
              ></span>
              <span className="lifeline">{hints}</span>
            </p>
          </div>
          <div className="timer-container">
            <p>
              <span className="left" style={{ float: 'left' }}>
                {currentQuestionIndex + 1} of {numberOfQuestions}
              </span>
              <span
                className={classNames('right valid', {
                  warning: time.distance <= 120000,
                  invalid: time.distance <= 30000,
                })}
              >
                {time.minutes}:{time.seconds}
                <span className="mdi mdi-clock-outline mdi-24px"></span>
              </span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          <div className="options-container">
            <p onClick={this.handleOnClick} className="option">
              {currentQuestion.optionA}
            </p>
            <p onClick={this.handleOnClick} className="option">
              {currentQuestion.optionB}
            </p>
          </div>
          <div className="options-container">
            <p onClick={this.handleOnClick} className="option">
              {currentQuestion.optionC}
            </p>
            <p onClick={this.handleOnClick} className="option">
              {currentQuestion.optionD}
            </p>
          </div>
          <div className="button-container">
            <button
              onClick={this.buttonClick}
              className={classNames('', { disable: this.state.previousButtonDisabled })}
              id="previous-button"
            >
              Previous
            </button>
            <button
              onClick={this.buttonClick}
              className={classNames('', { disable: this.state.nextButtonDisabled })}
              id="next-button"
            >
              Next
            </button>
            <button onClick={this.buttonClick} id="quit-button">
              Quit
            </button>
          </div>
        </div>
      </>
    );
  }
}
