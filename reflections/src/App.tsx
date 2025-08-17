import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

import './styles/App.css';
import './styles/variables.css';
import { Notification } from './components/Notification';

function App() {

    return (
        <BrowserRouter>
            <Notification>
                <Routes>

                    <Route path="/login" element={<Login />} />

                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/login" replace />} />

                </Routes>
            </Notification>
        </BrowserRouter>
    );
}

export default App;
