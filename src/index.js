import React from 'react';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import thunk from "redux-thunk"
import {Provider} from "react-redux";
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import reducers from './reducers';
import {BrowserRouter} from "react-router-dom";



const store = configureStore({
    middleware: [thunk],
    reducer: reducers
})

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



