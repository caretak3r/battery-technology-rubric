import React from 'react'
import ReactDOM from 'react-dom/client'
// Use absolute paths from the project root, which Vite supports.
// This makes the import resolution more robust against build environment issues.
import App from '/src/App.jsx'
import '/src/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
