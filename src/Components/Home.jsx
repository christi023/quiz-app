import React from 'react';
import { Link } from 'react-router-dom';
// component

// change our page title with package
//import { Helmet } from 'react-helmet';

const Home = () => (
  <>
    <div id="home">
      <section>
        <div styles={{ textAlign: 'center' }}>
          <span></span>
        </div>
        <h1>Quiz App</h1>
        <div className="play-button-container">
          <ul>
            <li>
              <Link className="play-button" to="/play/instructions">
                Play
              </Link>
            </li>
          </ul>
        </div>
        <div className="auth-container">
          <Link className="auth-button" id="login-button" to="/login">
            Login
          </Link>
          <Link className="auth-button" id="signup-button" to="/register">
            Register
          </Link>
        </div>
      </section>
    </div>
  </>
);

export default Home;
