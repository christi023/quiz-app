import React from 'react';
import { Link } from 'react-router-dom';
// change our page title with package
import { Helmet } from 'react-helmet';
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
const Home = () => (
  <>
    <Helmet>
      <title>Home - Quiz App</title>
    </Helmet>
    <div id="home">
      <Particles className="particles" params={ParticleParams} />
      <section>
        <div style={{ textAlign: 'center' }}>
          <span className="mdi mdi-cube-outline cube"></span>
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
