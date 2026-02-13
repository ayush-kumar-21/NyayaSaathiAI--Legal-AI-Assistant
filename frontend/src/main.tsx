import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// FIXED: Removed BrowserRouter and AuthProvider from here.
// They are already included in App.tsx.
// This prevents "You cannot render a <Router> inside another <Router>" error.

import GoogleAuthWrapper from './features/auth/GoogleAuthWrapper.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleAuthWrapper>
            <App />
        </GoogleAuthWrapper>
    </React.StrictMode>,
)
