import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/App/App';
import reducers from './reducers/';
import styles from './styles/index.css';

const store = createStore(reducers);
const rootElement = document.createElement('div');

document.body.appendChild(rootElement);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);
