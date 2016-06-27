import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

import styles from './styles/index.css';
console.log(styles);

main();

function main() {
    const app = document.createElement('div');
    document.body.appendChild(app);
    ReactDOM.render(<App />, app);
}
