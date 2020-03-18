import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';

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
      numberOfAnsweredQuestion: 0,
      numberOfUnansweredQuestion: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hints: 5,
      fiftyFifty: 2,
      usedFiftyFifty: false,
      time: {},
    };
  }

  //
  componentDidMount() {
    const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
    this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
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
      this.setState({
        currentQuestion,
        nextQuestion,
        previousQuestion,
        answer,
      });
    }
  };

  render() {
    const { currentQuestion } = this.state;
    return (
      <>
        <Helmet>Quiz Page</Helmet>
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
                1 of 15
              </span>
              <span className="right">
                12s
                <span className="mdi mdi-clock-outline mdi-24px"></span>
              </span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          <div className="options-container">
            <p className="option"> {currentQuestion.optionA}</p>
            <p className="option">{currentQuestion.optionB} </p>
          </div>
          <div className="options-container">
            <p className="option">{currentQuestion.optionC} </p>
            <p className="option">{currentQuestion.optionD}</p>
          </div>
          <div className="button-container">
            <button>Previous</button>
            <button>Next</button>
            <button>Quit</button>
          </div>
        </div>
      </>
    );
  }
}
