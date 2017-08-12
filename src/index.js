import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import Calculator from './component/Calculator';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Calculator />, document.getElementById('root'));
registerServiceWorker();
