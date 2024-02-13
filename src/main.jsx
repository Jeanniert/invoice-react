import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import axios from 'axios'

axios.defaults.baseURL= 'http://127.0.0.1:8000/'
axios.defaults.headers.common['Accept']= 'application/json'
axios.defaults.headers.common['Content-Type']= 'application/json'
axios.defaults.headers.common['X-Requested-With']= 'XMLHttpRequest'
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
