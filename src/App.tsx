import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import TodoPage from './components/TodoPage/TodoPage';
import './styles/todoStyles.css';
import './styles/styles.css';

function App() {
    return (
        <div className="app-container">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/todos" element={<TodoPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
