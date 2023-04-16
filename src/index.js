import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContext } from './Context/AuthContext';
const nodeRoot = document.getElementById('root');
nodeRoot.className = "cont"
const root = ReactDOM.createRoot(nodeRoot);
root.render(
  <React.StrictMode>
    <AuthContext>
      <App />
    </AuthContext>
  </React.StrictMode>
);
