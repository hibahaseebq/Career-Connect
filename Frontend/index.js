
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// Add this script to handle the ResizeObserver error
const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/;
const ignoreResizeObserverLoopError = (err) => {
  if (resizeObserverLoopErrRe.test(err.message)) {
    console.warn('Ignoring ResizeObserver loop error');
  } else {
    console.error(err);
  }
};
window.addEventListener('error', ignoreResizeObserverLoopError);
window.addEventListener('unhandledrejection', ignoreResizeObserverLoopError);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
