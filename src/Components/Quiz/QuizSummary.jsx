import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
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

export default class QuizSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hintsUsed: 0,
      fiftyFiftyUsed: 0,
    };
  }

  componentDidMount() {
    const { state } = this.props.location;
    this.setState({
      // display score as percentage, convert divide & multiply
      score: (state.score / state.numberOfQuestions) * 100,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      hintsUsed: state.hintsUsed,
      fiftyFiftyUsed: state.fiftyFiftyUsed,
    });
  }

  render() {
    const { state } = this.props.location;
    let stats, remark;
    const userScore = this.state.score;
    if (userScore <= 30) {
      remark = 'You need more practice';
    } else if (userScore > 30 && userScore <= 30) {
      remark = 'Better luck next time';
    } else if (userScore <= 70 && userScore > 50) {
      remark = 'You can do better';
    } else if (userScore >= 71 && userScore <= 84) {
      remark = 'You did great';
    } else {
      remark = "You're an absolute genius!";
    }
    if (state !== undefined) {
      stats = (
        <>
          <div style={{ textAlign: 'center' }}>
            <span className="mdi mdi-check-circle-outline success-icon"></span>
          </div>
          <h1>Quiz has ended</h1>
          <div className="container stats">
            <h4>{remark}</h4>
            <h2>Your score: {this.state.score.toFixed(0)}&#37;</h2>
            <span className="stat left">Total number of questions: </span>
            <span className=" right">{this.state.numberOfQuestions}</span>
            <br />

            <span className="stat left">Total number attempted questions: </span>
            <span className=" right">{this.state.numberOfAnsweredQuestions}</span>
            <br />

            <span className="stat left">Total number Correct Answers: </span>
            <span className=" right">{this.state.correctAnswers}</span>
            <br />

            <span className="stat left">Total number Wrong Answers: </span>
            <span className=" right">{this.state.wrongAnswers}</span>
            <br />

            <span className="stat left">Hints Used: </span>
            <span className=" right">{this.state.hintsUsed}</span>
            <br />

            <span className="stat left">50-50 Used: </span>
            <span className=" right">{this.state.fiftyFiftyUsed}</span>
          </div>
          <br />

          <section>
            <ul>
              <li>
                <Link to="/">Back to Home</Link>
              </li>
              <li>
                <Link to="/play/quiz">Play Again</Link>
              </li>
            </ul>
          </section>
        </>
      );
    } else {
      stats = (
        <section>
          <h1 className="no-stats">No Statistics Available</h1>;
          <ul>
            <li>
              <Link to="/">Back to Home</Link>
            </li>
            <li>
              <Link to="/play/quiz">Take a Quiz</Link>
            </li>
          </ul>
        </section>
      );
    }
    return (
      <>
        <Helmet>
          <title>Quiz App - Summary</title>
        </Helmet>

        <div className="quiz-summary">
          {stats}
          <Particles className="particles" params={ParticleParams} />
        </div>
      </>
    );
  }
}
