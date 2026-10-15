import React from 'react'
import { createRoot } from 'react-dom/client' // Changed this line
import App from './App.jsx'
import './index.css' 

// Changed the root creation method below
const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
