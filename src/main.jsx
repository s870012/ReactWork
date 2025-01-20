import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './ReactWeek4.jsx'
import 'bootstrap'
import './assets/all.scss'
// import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
