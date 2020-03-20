import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import M from 'materialize-css';
// import JSON file
import questions from '../../questions.json';
// import utils
import isEmpty from '../../utils/is-empty';
// import sound effects
import correctSound from '../../assets/audio/correct-answer.mp3';
import wrongSound from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';

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
      time: {},
    };

    // binding this methods
    this.handleOnClick = this.handleOnClick.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.nextButtonClick = this.nextButtonClick.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.quitButtonClick = this.quitButtonClick.bind(this);
    this.displayQuestions = this.displayQuestions.bind(this);
  }

  //
  componentDidMount() {
    const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
    this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
  }

  // play button sound
  playButtonSound = () => {
    document.getElementById('button-sound').play();
  };

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
      this.setState({
        currentQuestion,
        nextQuestion,
        previousQuestion,
        numberOfQuestions: questions.length,
        answer,
      });
    }
  };

  // Handle Click function, check to see if user clicks on right opt
  handleOnClick = e => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      setTimeout(() => {
        document.getElementById('correct-sound').play();
      }, 500); // delaying time play method

      // if target inner html is equal to answer, then correct
      this.correctAnswer(); // call correct answer method
    } else {
      setTimeout(() => {
        document.getElementById('wrong-sound').play();
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
        let { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(
          // passing the new state after the prevState have been updated
          questions,
          currentQuestion,
          nextQuestion,
          previousQuestion,
        );
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
        let { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(
          // passing the new state after the prevState have been updated
          questions,
          currentQuestion,
          nextQuestion,
          previousQuestion,
        );
      },
    );
  };
  render() {
    const { currentQuestion, currentQuestionIndex, numberOfQuestions } = this.state;
    return (
      <>
        <Helmet>Quiz Page</Helmet>
        <>
          <audio src={correctSound} id="correct-sound"></audio>
          <audio src={wrongSound} id="wrong-sound"></audio>
          <audio src={buttonSound} id="button-sound"></audio>
        </>
        <div className="questions">
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            <p>
              <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
              <span className="lifeline">2</span>
            </p>
            <p>
              <span className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span>
              <span className="lifeline">5</span>
            </p>
          </div>
          <div className="timer-container">
            <p>
              <span className="left" style={{ float: 'left' }}>
                {currentQuestionIndex + 1} of {numberOfQuestions}
              </span>
              <span className="right">
                12s
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
            <button onClick={this.buttonClick} id="previous-button">
              Previous
            </button>
            <button onClick={this.buttonClick} id="next-button">
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
