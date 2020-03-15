import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/@mdi/font/css/materialdesignicons.min.css';
//styles
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/materialize-css/dist/js/materialize.min.js';
import './styles/styles.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
