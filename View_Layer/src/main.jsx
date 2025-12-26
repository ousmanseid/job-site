console.log('1. main.jsx loaded');
import React from 'react'
console.log('2. React imported');
import ReactDOM from 'react-dom/client'
console.log('3. ReactDOM imported');
import App from './App.jsx'
console.log('4. App imported');
import 'bootstrap/dist/css/bootstrap.min.css'
console.log('5. Bootstrap CSS imported');
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
console.log('6. Bootstrap JS imported');
import './index.css'
console.log('7. index.css imported');

console.log('8. About to create root');
const rootElement = document.getElementById('root');
console.log('9. Root element:', rootElement);
const root = ReactDOM.createRoot(rootElement);
console.log('10. Root created, about to render');
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
console.log('11. Render called');

