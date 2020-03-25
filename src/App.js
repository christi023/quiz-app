import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Components
import Home from './Components/Home';
import Instructions from './Components/Quiz/Instructions';
import Play from './Components/Quiz/Play';
import QuizSummary from './Components/Quiz/QuizSummary';

// style package
import './App.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/play/instructions" exact component={Instructions} />
        <Route path="/play/quiz" exact component={Play} />
        <Route path="/play/quizSummary" exact component={QuizSummary} />
      </Router>
    );
  }
}
